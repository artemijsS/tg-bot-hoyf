import { Action, Ctx, Hears, Scene, SceneEnter, SceneLeave } from "nestjs-telegraf";
import { Markup, Context } from "telegraf";
import { NavigationE } from "../../enums/navigation.enum";
import { ScenesE } from "../../enums/scenes.enum";
import { UserService } from "../../../user/user.service";
import { checkAuth } from "../../utils/auth.guard";
import { sendSuccess } from "../../utils/success";
import { sendError } from "../../utils/errors";
import { ApplicationService } from "../../../application/application.service";
import { ConfigService } from "@nestjs/config";
import { ServicesE } from "../../enums/services.enum";
import { CountriesE } from "../../enums/countries.enum";
import { EmailService } from "../../../email/email.service";
import { ConfigE } from "../../enums/config.enum";


@Scene(ScenesE.createApplication)
export class CreateApplicationScene {

    private msgId: number = 0;
    private service: string = '';
    private contactType: string = '';
    private country: string = '';

    constructor(private configService: ConfigService,
                private userService: UserService,
                private applicationService: ApplicationService,
                private emailService: EmailService,
    ) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAuth(ctx, this.userService)) return;
        if (!ctx.state.service) {
            await ctx.scene.enter(ScenesE.services);
            return;
        }
        this.service = ctx.state.service;
        this.country = '';
        this.contactType = '';
        await ctx.replyWithHTML(`<b>${ctx.state.service}</b>`, Markup.keyboard([
            [NavigationE.back]
        ]).resize(true));

        if (this.service === ServicesE.companyRegistration) {
            await this.sendCountrySelect(ctx);
        } else {
            await this.sendContactTypeSelect(ctx);
        }

    }

    async sendContactTypeSelect(ctx: any) {
        const user = await this.userService.getByChatId(ctx.chat.id);
        const types = [];
        if (user.username !== ConfigE.noUsername)
            types.push(Markup.button.callback(NavigationE.telegram, 'Telegram'))
        types.push(Markup.button.callback(NavigationE.email, 'Email'))
        const msg = await ctx.replyWithHTML(`Укажите пожалуйста как удобнее связаться с вами?\n\n<i>После выбора, заявка будет отправлена нам</i>`,
            Markup.inlineKeyboard([
                types
            ]));
        this.msgId = msg.message_id;
    }

    async sendCountrySelect(ctx: any) {
        const countriesArray = Object.keys(CountriesE).map((key) => CountriesE[key]);
        const countryButtons = countriesArray.reduce((acc: any[], country: string, index: number) => {
            if (index % 2 === 0) {
                acc.push([Markup.button.callback(country, country)]);
            } else {
                acc[acc.length - 1].push(Markup.button.callback(country, country));
            }
            return acc;
        }, []);
        countryButtons.push()
        const msg = await ctx.replyWithHTML(`В какой стране вы планируете зарегистрировать компанию?`,
            Markup.inlineKeyboard(
                countryButtons
            ));
        this.msgId = msg.message_id;
    }

    @Action(Object.values(CountriesE))
    async getCountry(@Ctx() ctx: any) {
        if (!ctx.update.callback_query || !ctx.update.callback_query.data || !ctx.update.callback_query.message) {
            await sendError(ctx, "Попробуйте заного");
            return;
        }
        if (this.msgId !== ctx.update.callback_query.message.message_id) {
            return;
        }
        this.country = ctx.update.callback_query.data;
        await this.deleteInlineButtons(ctx, this.country);
        await this.sendContactTypeSelect(ctx);
    }

    @Action(["Telegram", "Email"])
    async createApplication(@Ctx() ctx: any) {
        if (!ctx.update.callback_query || !ctx.update.callback_query.data || !ctx.update.callback_query.message) {
            await sendError(ctx, "Попробуйте заного");
            return;
        }
        if (this.msgId !== ctx.update.callback_query.message.message_id) {
            return;
        }
        this.contactType = ctx.update.callback_query.data;
        try {
            const user = await this.userService.getByChatId(ctx.chat.id);
            if (user.username === ConfigE.noUsername && this.contactType === "Telegram") {
                await sendError(ctx, "У вашего аккаунта не хватает telegram username, пожалуйста выберете другой способ связи");
                await this.deleteInlineButtons(ctx, this.contactType);
                await this.sendContactTypeSelect(ctx);
                return;
            }
            const application = await this.applicationService.createApplication({
                user: user._id.toString(),
                service: this.service,
                contactType: this.contactType,
                country: this.country
            })
            await sendSuccess(ctx, "Заявка успешно сохранена!");
            await ctx.replyWithHTML(`
<b>Номер заяки - ${application.applicationNumber}</b>\n
Услуга - ${application.service}
${this.country ? "Страна регистрации - " + this.country + "\n" : ""}
Имя - ${user.name}
Выбранный контакт для связи - ${application.contactType === "Telegram" ? "@" + user.username : user.email}
`);
            delete ctx.state.service;

            this.emailService.sendApplicationEmail({
                to: this.configService.get("COMPANY_EMAIL"),
                service: application.service,
                applicationNumber: application.applicationNumber,
                country: application.country,
                contactType: application.contactType,
                username: user.username,
                email: user.email,
                name: user.name
            }).catch(async () => {
                await sendError(ctx, "Не получилось отправить заявку, попробуйте еще раз, или напишите пожалуйста нам на почту - " + this.configService.get("COMPANY_EMAIL"))
            });

            ctx.scene.enter(ScenesE.menu);
        } catch (e) {
            console.log(e)
            await sendError(ctx, "Проблема с отправкой заявки, напишите пожалуйста нам на почту - " + this.configService.get("COMPANY_EMAIL"))
            await this.back(ctx);
        }
    }

    @Hears(NavigationE.back)
    async back(@Ctx() ctx: any) {
        delete ctx.state.service;
        ctx.scene.enter(ScenesE.services);
    }

    @SceneLeave()
    async sceneLeave(ctx: Context) {
        if (this.contactType)
            await this.deleteInlineButtons(ctx, this.contactType);
        else
            await this.deleteInlineButtons(ctx, "");
    }

    async deleteInlineButtons(ctx: any, text: string) {
        if (this.msgId !== 0 && ctx.chat?.id) {
            try {
                const msg = await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, null);
                //@ts-ignore
                const newText = msg.text + (text ? "\n\n<b>Вы выбрали - " + text + "</b>" : "\n\n<b>Вы ничего не выбрали</b>");
                await ctx.telegram.editMessageText(ctx.chat.id, this.msgId, undefined, newText, {
                    parse_mode: "HTML"
                })
            } catch (error) {
                console.error("Error editing message reply markup:", error);
            }
        }
    }
}
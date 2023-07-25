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


@Scene(ScenesE.createApplication)
export class CreateApplicationScene {

    private msgId: number = 0;
    private service: string = '';
    private contactType: string = '';

    constructor(private configService: ConfigService,
                private userService: UserService,
                private applicationService: ApplicationService
    ) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAuth(ctx, this.userService)) return;
        if (!ctx.state.service) {
            await ctx.scene.enter(ScenesE.services);
            return;
        }
        this.service = ctx.state.service;
        await ctx.replyWithHTML(`<b>${ctx.state.service}</b>`, Markup.keyboard([
            [NavigationE.back]
        ]).resize(true));
        const msg = await ctx.replyWithHTML(`Укажите пожалуйста как удобнее связаться с вами?\n\n<i>После выбора, заявка будет отправлена нам</i>`,
            Markup.inlineKeyboard([
                [
                    Markup.button.callback(NavigationE.telegram, 'Telegram'),
                    Markup.button.callback(NavigationE.email, 'Email')
                ]
            ]));
        this.msgId = msg.message_id;
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
            const application = await this.applicationService.createApplication({
                user: user._id.toString(),
                service: this.service,
                contactType: this.contactType
            })
            await sendSuccess(ctx, "Заявка успешно отправлена!");
            await ctx.replyWithHTML(`
<b>Номер заяки - ${application.applicationNumber}</b>\n
Услуга - ${application.service}\nИмя - ${user.name}
Контакт для связи - ${application.contactType === "Telegram" ? "@" + user.username : user.email}
`);
            delete ctx.state.service;
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
        if (this.msgId !== 0 && ctx.chat?.id) {
            try {
                const msg = await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, null);
                //@ts-ignore
                const newText = msg.text + "\n\n<b>Вы выбрали - " + this.contactType + "</b>";
                await ctx.telegram.editMessageText(ctx.chat.id, this.msgId, undefined, newText, {
                    parse_mode: "HTML"
                })
            } catch (error) {
                console.error("Error editing message reply markup:", error);
            }
        }
    }
}
import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { ScenesE } from "../../enums/scenes.enum";
import { NavigationE } from "../../enums/navigation.enum";
import { SettingsE } from "../../enums/settings.enum";
import { UserService } from "../../../user/user.service";
import { sendError } from "../../utils/errors";
import { checkAuth } from "../../utils/auth.guard";
import { sendSuccess } from "../../utils/success";


@Scene(ScenesE.changeInfoScene)
export class ChangeInfoScene {

    constructor(private userService: UserService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        ctx.session.state = 'DONE';
        if (!await checkAuth(ctx, this.userService)) return;
        const user = await this.userService.getByChatId(ctx.chat.id);
        await ctx.reply(`Что вы хотите поменять?\n\nИмя - ${user.name}\nEmail - ${user.email}`,
            Markup.keyboard([
            [
                SettingsE.changeName,
                SettingsE.changeEmail,
            ],
            [NavigationE.back]
        ]).resize(true));
    }

    @Hears(SettingsE.changeName)
    async changeName(@Ctx() ctx: any) {
        ctx.session.state = "CHANGENAME";
        ctx.reply("Напишите свое имя:", Markup.keyboard([NavigationE.close]).resize(true));
    }

    @Hears(SettingsE.changeEmail)
    async changeEmail(@Ctx() ctx: any) {
        ctx.session.state = "CHANGEEMAIL";
        ctx.reply("Напишите свой email:", Markup.keyboard([NavigationE.close]).resize(true));
    }

    @Hears(NavigationE.back)
    async back(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.settings)
    }

    @Hears(NavigationE.close)
    async CloseInput(@Ctx() ctx: any) {
        ctx.scene.reenter();
    }

    @Hears(/.+/)
    async onText(@Ctx() ctx: any) {
        const currentState = ctx.session.state
        switch (currentState) {
            case "CHANGENAME":
                try {
                    await this.userService.changeName({
                        chatId: ctx.chat.id,
                        name: ctx.message.text
                    })
                    ctx.session.name = ctx.message.text;
                    ctx.session.state = 'DONE';
                    await sendSuccess(ctx, "Имя успешно изменено!");
                    ctx.scene.reenter();
                } catch (e) {
                    await sendError(ctx, e.message);
                    await this.changeName(ctx);
                }
                return;
            case "CHANGEEMAIL":
                try {
                    await this.userService.changeEmail({
                        chatId: ctx.chat.id,
                        email: ctx.message.text
                    })
                    ctx.session.email = ctx.message.text;
                    ctx.session.state = 'DONE';
                    await sendSuccess(ctx, "Email успешно изменен!");
                    ctx.scene.reenter();
                } catch (e) {
                    await sendError(ctx, e.message);
                    await this.changeEmail(ctx);
                }
                return;
            default:
                return;
        }
    }
}
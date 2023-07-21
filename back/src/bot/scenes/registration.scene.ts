import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { UserService } from "../../user/user.service";
import { sendError } from "../utils/errors";
import { ScenesE } from "../enums/scenes.enum";
import { Markup } from "telegraf";
import { NavigationE } from "../enums/navigation.enum";


@Scene(ScenesE.registration)
export class RegistrationScene {

    constructor(private userService: UserService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {

        if (await this.userService.getByChatId(ctx.chat.id)) {
            await ctx.reply('Вы уже заргистрированы');
            ctx.scene.enter(ScenesE.services);
            return;
        }

        ctx.session.state = 'NAME';
        await ctx.reply('Необходимо зарегестрироватся\n\nВведите пожалуйста имя:', Markup.keyboard([
            NavigationE.restart
        ]).resize(true));
    }

    @Hears(NavigationE.restart)
    async restart(@Ctx() ctx: any) {
        ctx.scene.reenter();
    }

    @Hears(/.+/)
    async onText(@Ctx() ctx: any) {
        const currentState = ctx.session.state || 'NAME';
        switch (currentState) {
            case "NAME":
                ctx.session.name = ctx.message.text;
                ctx.session.state = 'SURNAME';
                await ctx.replyWithHTML(`Имя - <b>${ctx.message.text}</b>\n\nВведите пожалуйста фамилию:`);
                return;
            case "SURNAME":
                ctx.session.lastname = ctx.message.text;
                ctx.session.state = 'EMAIL';
                await ctx.replyWithHTML(`Имя - <b>${ctx.session.name}</b>\nФамилия - <b>${ctx.message.text}</b>\n\nПоследнее, пожалуйста введите email:`);
                return;
            case "EMAIL":
                ctx.session.email = ctx.message.text;
                ctx.session.state = 'DONE';
                const { name, lastname, email } = ctx.session;
                const chatId = ctx.chat.id;
                const username = ctx.from.username;

                try {
                    const user = await this.userService.createUser({
                        name,
                        lastname,
                        email,
                        chatId,
                        username
                    })

                    await ctx.replyWithHTML(`Имя - <b>${user.name}</b>\nФамилия - <b>${user.lastname}</b>\nEmail - <b>${user.email}</b>\n\nСпасибо за регистрацию!`);
                    ctx.scene.enter(ScenesE.services);
                } catch (e) {
                    await sendError(ctx, e.message);
                    ctx.scene.reenter();
                }

                return;
            default:
                ctx.scene.leave();
        }
    }
}
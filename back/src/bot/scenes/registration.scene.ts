import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { UserService } from "../../user/user.service";
import { sendError } from "../utils/errors";
import { ScenesE } from "../enums/scenes.enum";
import { Markup } from "telegraf";
import { NavigationE } from "../enums/navigation.enum";
import { ConfigE } from "../enums/config.enum";


@Scene(ScenesE.registration)
export class RegistrationScene {

    private name = '';
    private email = '';
    private state = '';

    constructor(private userService: UserService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {

        if (await this.userService.getByChatId(ctx.chat.id)) {
            await ctx.reply('Вы уже заргистрированы');
            ctx.scene.enter(ScenesE.services);
            return;
        }
        this.name = '';
        this.email = '';
        this.state = 'NAME';
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
        const currentState = this.state || 'NAME';
        switch (currentState) {
            case "NAME":
                this.name = ctx.message.text;
                this.state = 'EMAIL';
                await ctx.replyWithHTML(`Имя - <b>${this.name}</b>\n\nВведите пожалуйста email:`);
                return;
            case "EMAIL":
                this.email = ctx.message.text;
                if (!this.name) {
                    await sendError(ctx, "Что-то пошло не так, попробуйте снова");
                    ctx.scene.reenter();
                    return;
                }
                this.state = 'DONE';
                const chatId = ctx.chat.id;
                const username = ctx.from.username ? ctx.from.username : ConfigE.noUsername;

                try {
                    const user = await this.userService.createUser({
                        name: this.name,
                        email: this.email,
                        chatId,
                        username
                    })

                    await ctx.replyWithHTML(`Имя - <b>${user.name}</b>\nEmail - <b>${user.email}</b>\n\nСпасибо за регистрацию!`);
                    ctx.scene.enter(ScenesE.services);
                } catch (e) {
                    await sendError(ctx, e.message);
                    ctx.scene.reenter();
                }

                return;
            default:
                ctx.scene.reenter();
        }
    }
}
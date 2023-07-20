import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { UserService } from "../../user/user.service";
import { sendError } from "../utils/errors";
import { ScenesE } from "../enums/scenes.enum";


@Scene(ScenesE.registration)
export class RegistrationScene {

    constructor(private userService: UserService) {
    }

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (await this.userService.getByChatId(ctx.chat.id)) {
            await ctx.reply('You are already registered!');
            ctx.scene.enter(ScenesE.services);
            return;
        }

        ctx.session.state = 'NAME';
        await ctx.reply('Please enter your name:');
    }

    @Hears(/.+/)
    async onText(@Ctx() ctx: any) {
        const currentState = ctx.session.state || 'NAME';
        switch (currentState) {
            case "NAME":
                ctx.session.name = ctx.message.text;
                ctx.session.state = 'SURNAME';
                await ctx.reply(`Thank you, ${ctx.message.text}. Now, please enter your surname:`);
                return;
            case "SURNAME":
                ctx.session.lastname = ctx.message.text;
                ctx.session.state = 'EMAIL';
                await ctx.reply(`Thank you, ${ctx.session.name} ${ctx.message.text}. Now, please enter your email:`);
                return;
            case "EMAIL":
                ctx.session.email = ctx.message.text;
                ctx.session.state = 'DONE';
                const { name, lastname, email } = ctx.session;
                const chatId = ctx.chat.id;
                const username = ctx.from.username;

                try {
                    await this.userService.createUser({
                        name,
                        lastname,
                        email,
                        chatId,
                        username
                    })

                    await ctx.reply(`Name - ${ctx.session.name}\nSurname - ${ctx.session.surname}\nEmail - ${ctx.session.email}\n\nThank You!`);
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
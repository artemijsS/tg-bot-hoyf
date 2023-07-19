import { Action, Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup, Context } from "telegraf";
import { SceneContextScene } from "telegraf/typings/scenes";


@Scene('registration')
export class RegistrationScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        ctx.session.state = 'NAME';
        await ctx.reply('Please enter your name:');
    }

    @Hears(/.+/)
    async onText(@Ctx() ctx: any) {
        const currentState = ctx.session.state || 'NAME';
        if (currentState === 'NAME') {
            ctx.session.name = ctx.message.text;
            ctx.session.state = 'EMAIL';
            await ctx.reply(`Thank you, ${ctx.message.text}. Now, please enter your email:`);
        } else if (currentState === 'EMAIL') {
            ctx.session.email = ctx.message.text;
            ctx.session.state = 'DONE';
            await ctx.reply(`Thank you, ${ctx.session.name}! Registration complete. Your email is ${ctx.message.text}.`);
            ctx.scene.leave(); // Leave the scene after registration is complete
        }
    }
}
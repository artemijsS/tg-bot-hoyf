import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";


@Scene('changeInfoScene')
export class ChangeInfoScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        ctx.session.state = 'DONE';
        await ctx.reply(`What do you want to change?\n\nName - ${ctx.session.name}\nSurname - ${ctx.session.surname}\nEmail - ${ctx.session.email}`,
            Markup.keyboard([
            [
                'Name',
                'Surname',
                'Email',
            ],
            ['Back']
        ]).resize(true));
    }

    @Hears('Name')
    async changeName(@Ctx() ctx: any) {
        ctx.session.state = "CHANGENAME";
        ctx.reply("Enter Your name:", Markup.keyboard(['Close']).resize(true));
    }

    @Hears('Surname')
    async changeSurname(@Ctx() ctx: any) {
        ctx.session.state = "CHANGESURNAME";
        ctx.reply("Enter Your surname:", Markup.keyboard(['Close']).resize(true));
    }

    @Hears('Email')
    async changeEmail(@Ctx() ctx: any) {
        ctx.session.state = "CHANGEEMAIL";
        ctx.reply("Enter Your email:", Markup.keyboard(['Close']).resize(true));
    }

    @Hears('Back')
    async back(@Ctx() ctx: any) {
        ctx.scene.enter('settingsScene')
    }

    @Hears('Close')
    async CloseInput(@Ctx() ctx: any) {
        ctx.scene.reenter();
    }

    @Hears(/.+/)
    async onText(@Ctx() ctx: any) {
        const currentState = ctx.session.state
        switch (currentState) {
            case "CHANGENAME":
                ctx.session.name = ctx.message.text;
                ctx.session.state = 'DONE';
                ctx.scene.reenter();
                return;
            case "CHANGESURNAME":
                ctx.session.surname = ctx.message.text;
                ctx.session.state = 'DONE';
                ctx.scene.reenter();
                return;
            case "CHANGEEMAIL":
                ctx.session.email = ctx.message.text;
                ctx.session.state = 'DONE';
                ctx.scene.reenter();
                return;
            default:
                return;
        }
    }
}
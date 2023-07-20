import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { ScenesE } from "../../enums/scenes.enum";
import { NavigationE } from "../../enums/navigation.enum";
import { SettingsE } from "../../enums/settings.enum";


@Scene(ScenesE.changeInfoScene)
export class ChangeInfoScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        ctx.session.state = 'DONE';
        await ctx.reply(`What do you want to change?\n\nName - ${ctx.session.name}\nSurname - ${ctx.session.surname}\nEmail - ${ctx.session.email}`,
            Markup.keyboard([
            [
                SettingsE.changeName,
                SettingsE.changeLastname,
                SettingsE.changeEmail,
            ],
            [NavigationE.back]
        ]).resize(true));
    }

    @Hears(SettingsE.changeName)
    async changeName(@Ctx() ctx: any) {
        ctx.session.state = "CHANGENAME";
        ctx.reply("Enter Your name:", Markup.keyboard([NavigationE.close]).resize(true));
    }

    @Hears(SettingsE.changeLastname)
    async changeSurname(@Ctx() ctx: any) {
        ctx.session.state = "CHANGESURNAME";
        ctx.reply("Enter Your surname:", Markup.keyboard([NavigationE.close]).resize(true));
    }

    @Hears(SettingsE.changeEmail)
    async changeEmail(@Ctx() ctx: any) {
        ctx.session.state = "CHANGEEMAIL";
        ctx.reply("Enter Your email:", Markup.keyboard([NavigationE.close]).resize(true));
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
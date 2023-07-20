import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";


@Scene('settingsScene')
export class SettingsScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        await ctx.reply('How can I help You?', Markup.keyboard([
            [
                'Change info',
                'About Us'
            ],
            [
                'Menu'
            ]
        ]).resize(true));
    }

    @Hears('Change info')
    async changeInfo(@Ctx() ctx: any) {
        ctx.scene.enter('changeInfoScene');
    }

    @Hears('Menu')
    async menu(@Ctx() ctx: any) {
        ctx.scene.enter('menuScene');
    }
}
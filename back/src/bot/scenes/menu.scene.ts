import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";


@Scene('menuScene')
export class MenuScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        await ctx.reply('Menu \n\n Choose operation', Markup.keyboard([
            'Select service',
            'Settings'
        ]).resize(true));
    }

    @Hears('Settings')
    async settings(@Ctx() ctx: any) {
        ctx.scene.enter('settingsScene');
    }

    @Hears('Select service')
    async services(@Ctx() ctx: any) {
        ctx.scene.enter('showServicesScene');
    }
}
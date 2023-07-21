import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { ScenesE } from "../enums/scenes.enum";
import { NavigationE } from "../enums/navigation.enum";


@Scene(ScenesE.menu)
export class MenuScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        await ctx.reply('Меню \n\n Выберете желаемое действие', Markup.keyboard([
            NavigationE.services,
            NavigationE.settings
        ]).resize(true));
    }

    @Hears(NavigationE.settings)
    async settings(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.settings);
    }

    @Hears(NavigationE.services)
    async services(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.services);
    }
}
import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { ScenesE } from "../enums/scenes.enum";
import { NavigationE } from "../enums/navigation.enum";


@Scene(ScenesE.settings)
export class SettingsScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        await ctx.reply('How can I help You?', Markup.keyboard([
            [
                NavigationE.changeUserInfo,
                NavigationE.writeToUs
            ],
            [
                NavigationE.menu
            ]
        ]).resize(true));
    }

    @Hears(NavigationE.changeUserInfo)
    async changeInfo(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.changeInfoScene);
    }

    @Hears(NavigationE.writeToUs)
    async writeToUs(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.writeToUs);
    }

    @Hears(NavigationE.menu)
    async menu(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.menu);
    }
}
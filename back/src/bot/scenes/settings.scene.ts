import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { ScenesE } from "../enums/scenes.enum";
import { NavigationE } from "../enums/navigation.enum";
import { UserService } from "../../user/user.service";
import { checkAuth } from "../utils/auth.guard";


@Scene(ScenesE.settings)
export class SettingsScene {

    constructor(private userService: UserService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAuth(ctx, this.userService)) return;
        await ctx.reply('Чем я могу помочь?', Markup.keyboard([
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
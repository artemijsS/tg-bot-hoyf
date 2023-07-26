import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { ScenesE } from "../../enums/scenes.enum";
import { NavigationE } from "../../enums/navigation.enum";
import { UserService } from "../../../user/user.service";
import { checkAdmin } from "../../utils/auth.guard";


@Scene(ScenesE.adminScene)
export class AdminScene {

    constructor(private userService: UserService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAdmin(ctx, this.userService)) return;
        await ctx.reply('👮‍♂️Зона администратора 👮‍♂️', Markup.keyboard([
            [
                NavigationE.findUserByUsername,
            ],
            [
                NavigationE.menu
            ]
        ]).resize(true));
    }

    @Hears(NavigationE.findUserByUsername)
    async userFind(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.adminFindUser);
    }

    @Hears(NavigationE.menu)
    async menu(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.menu);
    }
}
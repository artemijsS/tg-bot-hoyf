import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { NavigationE } from "../../enums/navigation.enum";
import { ScenesE } from "../../enums/scenes.enum";
import { UserService } from "../../../user/user.service";
import { checkAuth } from "../../utils/auth.guard";


@Scene(ScenesE.services)
export class ShowServicesScene {

    constructor(private userService: UserService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAuth(ctx, this.userService)) return;
        await ctx.reply(`Какая услуга необходима?`,
            Markup.keyboard([
                [
                    'Услуга 1',
                    'Услуга 2',
                ],
                [
                    'Услуга 3',
                    'Услуга 4',
                ],
                [
                    'Услуга 5',
                    'Услуга 6',
                ],
                [
                    'Услуга 7',
                    'Услуга 8',
                ],
                [
                    'Услуга 9',
                    'Услуга 10',
                ],
                [
                    'Услуга 11',
                    'Услуга 12',
                ],
                [
                    'Услуга 13',
                    'Услуга 14',
                ],
                [
                    'Услуга 15',
                ],
                [NavigationE.menu]
            ]).resize(true));
    }

    @Hears(NavigationE.menu)
    async back(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.menu)
    }
}
import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { NavigationE } from "../../enums/navigation.enum";
import { ScenesE } from "../../enums/scenes.enum";


@Scene(ScenesE.services)
export class ShowServicesScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        await ctx.reply(`Что вас интересует?`,
            Markup.keyboard([
                [
                    '1 asdas',
                    '2 asd asd',
                ],
                [
                    '4 asdaklsdjlkas',
                    '5 asdaklsdjlkas',
                ],
                [
                    '7 asdaklsdjlkas',
                    '8 asdaklsdjlkas',
                ],
                [
                    '7 asdaklsdjlkas',
                    '8 asdaklsdjlkas',
                ],
                [
                    '7 asdaklsdjlkas',
                    '8 asdaklsdjlkas',
                ],
                [
                    '7 asdaklsdjlkas',
                    '8 asdaklsdjlkas',
                ],
                [
                    '7 asdaklsdjlkas',
                    '8 asdaklsdjlkas',
                ],
                [
                    '7 asdaklsdjlkas',
                ],
                [NavigationE.menu]
            ]).resize(true));
    }

    @Hears(NavigationE.menu)
    async back(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.menu)
    }
}
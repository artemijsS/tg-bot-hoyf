import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";


@Scene('showServicesScene')
export class ShowServicesScene {

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        await ctx.reply(`What do you want to do?`,
            Markup.keyboard([
                [
                    '1 asdas',
                    '2 asd asd',
                    '3 asdaklsdjlkas',
                ],
                [
                    '4 asdaklsdjlkas',
                    '5 asdaklsdjlkas',
                    '6 asdaklsdjlkas',
                ],
                [
                    '7 asdaklsdjlkas',
                    '8 asdaklsdjlkas',
                    '9 asdaklsdjlkas',
                ],
                ['Back']
            ]).resize(true));
    }

    @Hears('Back')
    async back(@Ctx() ctx: any) {
        ctx.scene.enter('menuScene')
    }
}
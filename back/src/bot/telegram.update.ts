import { Injectable } from '@nestjs/common';
import { Ctx, Start, InjectBot, Update, Hears } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { SceneContextScene } from "telegraf/typings/scenes";
import { ScenesE } from "./enums/scenes.enum";

@Update()
@Injectable()
export class TelegramUpdate {
    constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

    @Start()
    async onStart(@Ctx() ctx: Context) {
        //@ts-ignore
        const scene = ctx.scene as SceneContextScene
        await scene.enter(ScenesE.registration)
    }

    @Hears('/menu')
    async onMenu(@Ctx() ctx: Context) {
        //@ts-ignore
        const scene = ctx.scene as SceneContextScene
        await scene.enter(ScenesE.menu)
    }

    @Hears('/settings')
    async onSettings(@Ctx() ctx: Context) {
        //@ts-ignore
        const scene = ctx.scene as SceneContextScene
        await scene.enter(ScenesE.settings)
    }

    @Hears('/contact')
    async onContact(@Ctx() ctx: Context) {
        //@ts-ignore
        const scene = ctx.scene as SceneContextScene
        await scene.enter(ScenesE.writeToUs)
    }
}

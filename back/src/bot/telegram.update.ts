// telegram.update.ts
import { Injectable } from '@nestjs/common';
import { Ctx, Start, Hears, InjectBot, Command, Update } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { RegistrationScene } from "./registration.scene";
import { SceneContextScene } from "telegraf/typings/scenes";

@Update()
@Injectable()
export class TelegramUpdate {
    constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

    @Start()
    async onStart(@Ctx() ctx: Context) {
        //@ts-ignore
        const scene = ctx.scene as SceneContextScene

        await scene.enter('registration')
    }

    @Command('hello')
    async onHelloCommand(@Ctx() ctx: Context) {
        await ctx.reply('Hello, nice to meet you!');
    }

    @Hears('cat')
    async onCatKeyword(@Ctx() ctx: Context) {
        await ctx.reply('Hello, nice to meet you!');
    }
}

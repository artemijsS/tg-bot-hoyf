import { Ctx, Hears, On, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup, Context } from "telegraf";
import { ScenesE } from "../../enums/scenes.enum";
import { NavigationE } from "../../enums/navigation.enum";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../../user/user.service";
import { checkAuth } from "../../utils/auth.guard";
import { sendSuccess } from "../../utils/success";
import { sendError } from "../../utils/errors";


@Scene(ScenesE.writeToUs)
export class WriteToUsScene {

    constructor(private configService: ConfigService, private userService: UserService) {
    }

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAuth(ctx, this.userService)) return;
        await ctx.reply('Напишите сообщение которое хотите отправить нам!', Markup.keyboard([
            [
                NavigationE.settings
            ]
        ]).resize(true));
    }

    @Hears(NavigationE.settings)
    async back(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.settings);
    }

    @On('message')
    async forwardMessage(@Ctx() ctx: Context) {
        try {
            const user = await this.userService.getByChatId(ctx.chat.id);
            const adminsIds = await this.userService.getAdminChatIds();
            for (const adminId of adminsIds) {
                await ctx.telegram.sendMessage(adminId, "Новое сообщение от\n\n" + user.name + " " + user.lastname + "\n" + user.email + "\n@" + user.username);
                await ctx.forwardMessage(adminId);
            }
            await sendSuccess(ctx, "Сообщение успешно отправлено!");
        } catch (e) {
            await sendError(ctx, "Ошибка с отправлением Вашего сообщения, напишите пожалуйста нам на почту - " + this.configService.get("COMPANY_EMAIL"));
            console.log(e)
        } finally {
            await this.back(ctx);
        }
    }
}
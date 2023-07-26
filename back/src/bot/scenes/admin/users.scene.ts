import { Action, Ctx, Hears, Scene, SceneEnter, SceneLeave } from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { ScenesE } from "../../enums/scenes.enum";
import { NavigationE } from "../../enums/navigation.enum";
import { UserService } from "../../../user/user.service";
import { checkAdmin } from "../../utils/auth.guard";
import { ApplicationService } from "../../../application/application.service";


@Scene(ScenesE.adminFindUser)
export class UsersAdminScene {

    private msgId: number = 0;
    private page: number = 0;
    private userId: string = '';

    constructor(
        private userService: UserService,
        private applicationService: ApplicationService,
    ) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAdmin(ctx, this.userService)) return;
        this.page = 0;
        this.userId = '';
        await ctx.reply('👮‍♂️Поиск пользователей 👮‍♂️', Markup.keyboard([
            [
                NavigationE.back
            ]
        ]).resize(true));
        const msg = await ctx.replyWithHTML('Выбрете пользователя',
            Markup.inlineKeyboard(await this.getUsersButtons()));
        this.msgId = msg.message_id;
    }

    @Action("More")
    async more(@Ctx() ctx: any) {
        if (!this.msgId) {
            ctx.scene.reenter();
            return;
        }
        this.page = this.page + 1;
        const keyboard = await this.getUsersButtons(this.page);
        await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, {
            inline_keyboard: keyboard
        })
    }

    @Action("Back")
    async back(@Ctx() ctx: any) {
        if (!this.page) {
            ctx.scene.reenter();
            return;
        }
        this.page = this.page - 1;
        const keyboard = await this.getUsersButtons(this.page);
        await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, {
            inline_keyboard: keyboard
        })
    }

    @Action("BackToList")
    async backToList(@Ctx() ctx: any) {
        const keyboard = await this.getUsersButtons(this.page);
        this.userId = '';
        await ctx.telegram.editMessageText(ctx.chat.id, this.msgId, undefined, 'Выбрете пользователя')
        await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, {
            inline_keyboard: keyboard
        })
    }

    @Action("ShowApplications")
    async showApplications(@Ctx() ctx: Context) {
        if (!this.msgId || !this.userId) {
            //@ts-ignore
            ctx.scene.reenter();
            return;
        }
        const applications = await this.applicationService.getApplicationsByUser(this.userId);

        for (const application of applications) {
            await ctx.telegram.sendMessage(ctx.chat.id, `Номер заяви - #${application.applicationNumber}
Услуга - ${application.service}
${application.country ? "Страна - " + application.country + "\n" : ""}
Через что связаться - ${application.contactType}
            `);
        }
        // await ctx.telegram.copyMessage(ctx.chat.id, ctx.chat.id, this.msgId);
        const msg = await ctx.telegram.copyMessage(ctx.chat.id, ctx.chat.id, this.msgId);
        await ctx.telegram.deleteMessage(ctx.chat.id, this.msgId);
        this.msgId = msg.message_id;
        await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, {
            inline_keyboard: [
                [
                    Markup.button.callback("Посмотреть заявки", "ShowApplications"),
                    Markup.button.callback("Вернуться к списку", "BackToList"),
                ]
            ]
        })
    }

    @Action(/^userId!!/)
    async userClick(@Ctx() ctx: any) {
        if (this.msgId !== ctx.update.callback_query.message.message_id) {
            return;
        }
        const userId = ctx.update.callback_query.data.split("userId!!")[1];
        const user = await this.userService.getById(userId);
        if (!user) return;

        this.userId = userId;
        await ctx.telegram.editMessageText(ctx.chat.id, this.msgId, undefined, `Пользователь - @${user.username}

Имя - ${user.name}
Email - ${user.email}
ChatId - ${user.chatId}
        `)
        await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, {
            inline_keyboard: [
                [
                    Markup.button.callback("Посмотреть заявки", "ShowApplications"),
                    Markup.button.callback("Вернуться к списку", "BackToList"),
                ]
            ]
        })
    }

    @Hears(NavigationE.back)
    async menu(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.adminScene);
    }

    async getUsersButtons(page: number = 0) {
        const usersRes = await this.userService.getUsersByUsername(page);
        const arr = [];
        const chunkSize = 2;

        const result = [];
        const tmp = [];
        for (let i = 0; i < usersRes.users.length; i++) {
            tmp[i] = Markup.button.callback(usersRes.users[i].username, `userId!!${usersRes.users[i]._id}`)
        }
        for (let i = 0; i < tmp.length; i += chunkSize) {
            result.push(tmp.slice(i, i + chunkSize));
        }
        for (let i = 0; i < result.length; i++) {
            arr.push(result[i]);
        }
        const nav = [];
        if (page > 0)
            nav.push(Markup.button.callback("Назад", `Back`));
        if (usersRes.totalPages > (page + 1))
            nav.push(Markup.button.callback("Далее", `More`));

        arr.push(nav);

        return arr;
    }

    @SceneLeave()
    async onLeave(@Ctx() ctx: any) {
        if (this.msgId) {
            await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, this.msgId, undefined, null);
        }
    }

}
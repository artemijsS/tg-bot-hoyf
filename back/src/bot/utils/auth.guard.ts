import { ScenesE } from "../enums/scenes.enum";
import { UserService } from "../../user/user.service";
import { ConfigE } from "../enums/config.enum";

export const checkAuth = async (ctx: any, userService: UserService): Promise<boolean> => {
    const user = await userService.getByChatId(ctx.chat.id);
    if (!user) {
        await ctx.scene.enter(ScenesE.registration);
        return false;
    }
    if (user.username === ConfigE.noUsername && ctx.from.username) {
        try {
            await userService.changeTgUsername({ chatId: ctx.chat.id, username: ctx.from.username });
        } catch (e) {
            console.log(e)
        }
    }
    return true;
}

export const checkAdmin = async (ctx: any, userService: UserService): Promise<boolean> => {
    const user = await userService.getByChatId(ctx.chat.id);
    if (!user) {
        await ctx.scene.enter(ScenesE.registration);
        return false;
    }
    if (user.role !== "admin") {
        await ctx.scene.enter(ScenesE.menu);
        return false;
    }
    return true;
}
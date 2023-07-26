import { ScenesE } from "../enums/scenes.enum";
import { UserService } from "../../user/user.service";

export const checkAuth = async (ctx: any, userService: UserService): Promise<boolean> => {
    const user = await userService.getByChatId(ctx.chat.id);
    if (!user) {
        await ctx.scene.enter(ScenesE.registration);
        return false;
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
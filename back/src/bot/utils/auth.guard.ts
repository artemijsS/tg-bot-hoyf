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
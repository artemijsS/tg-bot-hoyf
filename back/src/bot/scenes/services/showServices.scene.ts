import { Ctx, Hears, Scene, SceneEnter } from "nestjs-telegraf";
import { Markup } from "telegraf";
import { NavigationE } from "../../enums/navigation.enum";
import { ScenesE } from "../../enums/scenes.enum";
import { UserService } from "../../../user/user.service";
import { checkAuth } from "../../utils/auth.guard";
import { ServicesE } from "../../enums/services.enum";


@Scene(ScenesE.services)
export class ShowServicesScene {

    constructor(private userService: UserService) {}

    @SceneEnter()
    async onEnter(@Ctx() ctx: any) {
        if (!await checkAuth(ctx, this.userService)) return;
        await ctx.reply(`Какая услуга необходима?`,
            Markup.keyboard([
                [
                    ServicesE.companyRegistration,
                ],
                [
                    ServicesE.companyTransfer,
                ],
                [
                    ServicesE.financialStatements,
                ],
                [
                    ServicesE.additionalDocuments,
                ],
                [
                    ServicesE.vatNumber,
                    ServicesE.helpAccountIBAN,
                ],
                [
                    ServicesE.helpAccountMerchant,
                    ServicesE.residencePermit,
                ],
                [NavigationE.menu]
            ]).resize(true));
    }

    @Hears(ServicesE.companyRegistration)
    async companyRegistration(@Ctx() ctx: any) {
        ctx.scene.reenter()
    }

    @Hears(Object.keys(ServicesE).filter((key: string) => key !== "companyRegistration").map((key: string) => ServicesE[key]))
    async defaultService(@Ctx() ctx: any) {
        ctx.state.service = ctx.message.text;
        ctx.scene.enter(ScenesE.createApplication);
    }

    @Hears(NavigationE.menu)
    async back(@Ctx() ctx: any) {
        ctx.scene.enter(ScenesE.menu)
    }
}
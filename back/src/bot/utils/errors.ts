export const sendError = async (ctx, error: string) => {
    await ctx.reply(`⛔️ Ошибка ⛔️\n\n${error || "Error, try one more time"}`);
}
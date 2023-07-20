export const sendError = async (ctx, error: string) => {
    await ctx.reply(error || "Error, try one more time");
}
export const sendSuccess = async (ctx, msg: string) => {
    await ctx.reply(`✅ Отлично ✅\n\n${msg}`);
}
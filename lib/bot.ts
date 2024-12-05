import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

const keyboard = new InlineKeyboard()
    .text("Обо мне", "/about")
    .text("Интересы", "/interests");

bot.command("start", (ctx) => ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard }));

bot.on("message", (ctx) => ctx.reply("Получил ваше сообщение: " + ctx.message.text + " !"));

// Обработка команды /about
bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Я бот? Я бот... Я Бот!");
});

// Обработка команды /interests
bot.command("interests", async (ctx) => {
    await ctx.reply("Напиши свой интерес:");
});

// Обработка текстовых сообщений после команды /interests
bot.on("message", (ctx) => {
    if (ctx.message.text && ctx.message.text.startsWith("Интерес: ")) {
        // Это сообщение уже обрабатывается для других случаев. Пропускаем его.
        return;
    }
    
    ctx.reply("Ваш интерес: " + ctx.message.text);
});
bot.start();





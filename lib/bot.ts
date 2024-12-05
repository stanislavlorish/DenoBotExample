import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || ""); // Токен вашего бота

const keyboard = new InlineKeyboard()
    .text("Обо мне", "/about")
    .text("Интересы", "/interests");

// Обработайте команду /start.
bot.command("start", (ctx) => ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard }));

// Обработайте команду /about
bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery(); // Уведомляем Telegram, что мы обработали запрос
    await ctx.reply("Я бот? Я бот... Я Бот!");
});

// Обработка команды /interests
bot.command("interests", async (ctx) => {
    await ctx.reply("Напиши свой интерес:");
});

// Обработка сообщений, полученных после команды /interests
bot.on("message", (ctx) => {
    if (ctx.message.text && ctx.message.text !== "/interests" && !ctx.message.text.startsWith("Ваш интерес: ")) {
        ctx.reply("Ваш интерес: " + ctx.message.text);
    }
});

// Обработайте другие сообщения.
bot.on("message", (ctx) => ctx.reply("Получил ваше сообщение: " + ctx.message.text + " !"));




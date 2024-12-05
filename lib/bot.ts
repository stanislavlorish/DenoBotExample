import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");
const userInterests = new Map<string, string>(); // Храним интересы пользователей

// Обработайте команду /start.
bot.command("start", (ctx) => 
    ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard })
);

// Обработайте команду /interested.
bot.command("interested", (ctx) => {
    ctx.reply("Напишите свой интерес, и я его запомню!");
});

// Обработка сообщений от пользователей для сохранения интересов
bot.on("message", (ctx) => {
    const userId = ctx.from?.id.toString();
    
    if (userId) {
        // Проверяем, хранится ли интерес пользователя
        if (userInterests.has(userId) && userInterests.get(userId) === '') {
            const interest = ctx.message.text;
            userInterests.set(userId, interest);
            ctx.reply(`Ваш интерес "${interest}" сохранен!`);
        }
        // Если пользователь еще не отправил интерес
        else if (!userInterests.has(userId)) {
            ctx.reply("Пожалуйста, используйте команду /interested, чтобы начать.");
            userInterests.set(userId, ''); // Запоминаем, что пользователь пожелал отправить интерес
        }
    } else {
        ctx.reply("Не могу определить ваш ID.");
    }
});

// Клавиатура будет отправлять в бота команду /about
const keyboard = new InlineKeyboard()
    .text("Обо мне", "/about");

bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery(); // Уведомляем Telegram, что мы обработали запрос
    await ctx.reply("Я бот? Я бот... Я Бот!");
});

// Запускаем бота
await bot.start(); // Используем await для ожидания завершения запуска






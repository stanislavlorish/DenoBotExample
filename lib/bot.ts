import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";
import { Database } from "https://deno.land/x/sqlite/mod.ts";

// Создаем экземпляр класса Bot
export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

// Настройка базы данных
const db = new Database('database.db');

// Создаем таблицу, если она не существует
db.execute(`CREATE TABLE IF NOT EXISTS interested_users (
    user_id INTEGER,
    message TEXT
)`);

// Обработка команды /start
bot.command("start", (ctx) => {
    const keyboard = new InlineKeyboard().text("Обо мне", "/about");
    return ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard });
});

// Обработка команды /interested
bot.command("interested", async (ctx) => {
    const userId = ctx.from?.id;
    const userMessage = ctx.message?.text?.replace("/interested ", "");

    if (userId && userMessage) {
        // Запись в базу данных
        db.execute('INSERT INTO interested_users (user_id, message) VALUES (?, ?)', 
            [userId, userMessage]
        );
        await ctx.reply('Ваш интерес записан!');
    } else {
        await ctx.reply('Пожалуйста, укажите ваш интерес после команды /interested.');
    }
});

// Обработка других сообщений
bot.on("message", (ctx) => ctx.reply("Получил ваше сообщение: " + ctx.message.text + " !"));

const keyboard = new InlineKeyboard();
keyboard.text("Обо мне", "/about");

bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Я бот? Я бот... Я Бот!");
});

// Запуск бота
bot.start();
console.log('Бот запущен!');




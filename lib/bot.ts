import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts"; // Измените импорт на DB

// Создайте экземпляр класса Bot и передайте ему токен вашего бота.
export const bot = new Bot(Deno.env.get("BOT_TOKEN") || ""); 

// Настройка базы данных
const db = new DB('database.db'); // Используйте DB вместо Database

// Создаем таблицу, если она не существует
db.execute(`CREATE TABLE IF NOT EXISTS interested_users (
    user_id INTEGER,
    message TEXT
)`);

// Клавиатура будет отправлять в бота команду /about
const keyboard = new InlineKeyboard()
    .text("Обо мне", "/about");

// Обработайте команду /start
bot.command("start", (ctx) => {
    ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard });
});

// Обработка команды /interested
bot.command("interested", async (ctx) => {
    await ctx.reply("Напиши свои интересы:");
    // Устанавливаем состояние ожидания введенного текста
    ctx.session.state = "waiting_interests";
});

// Обработка других сообщений
bot.on("message", async (ctx) => {
    // Проверка состояния, если пользователь ждет ввода интересов
    if (ctx.session.state === "waiting_interests") {
        const userId = ctx.from?.id;
        const userMessage = ctx.message.text;

        // Запись в базу данных
        db.execute('INSERT INTO interested_users (user_id, message) VALUES (?, ?)', 
            [userId, userMessage]
        );

        await ctx.reply('Ваши интересы записаны: ' + userMessage);
        ctx.session.state = null; // Сбрасываем состояние
        return;
    }

    ctx.reply("Получил ваше сообщение: " + ctx.message.text + " !");
});

// Обработка нажатия на кнопку "Обо мне"
bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery(); 
    await ctx.reply("Я бот? Я бот... Я Бот!");
});

// Запуск бота
bot.start();
console.log('Бот запущен!');







import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");
// Создайте экземпляр класса `Bot` и передайте ему токен вашего бота.
// Токен и адрес бэкенда мы спрячем, чтобы никто не смог воспользоваться нашим ботом или взломать нас. Получим их из файла .env (или из настроек в Deno Deploy)
export const bot = new Bot(Deno.env.get("BOT_TOKEN") || ""); // export нужен, чтобы воспользоваться ботом в другом файле

interface UserInfo {
    chatId: number;
    interests: string;
    city: string;
}

const users: UserInfo[] = []; // Массив для хранения пользователей

// Клавиатура будет отправлять в бота команду /about
const keyboard = new InlineKeyboard().text("Обо мне", "/about");
// Теперь вы можете зарегистрировать слушателей на объекте вашего бота `bot`.
// grammY будет вызывать слушателей, когда пользователи будут отправлять сообщения вашему боту.

// Обработайте команду /start.
bot.command("start", async (ctx) => {
    await ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard });
    await ctx.reply("Напишите свои интересы и город в формате: 'интересы, город'");
});
bot.command(
    "start",
    (ctx) => ctx.reply("Добро пожаловать. Запущен и работает!",{ reply_markup: keyboard }),
);

// Обработайте сообщения от пользователей.
bot.on("message", async (ctx) => {
    const [interests, city] = ctx.message.text.split(",").map((s) => s.trim());

    if (!interests || !city) {
        return await ctx.reply("Пожалуйста, укажите интересы и город в формате: 'интересы, город'");
    }

    const userInfo: UserInfo = { chatId: ctx.chat.id, interests, city };
    users.push(userInfo);

    // Проверяем на совпадения с другими пользователями
    const matches = users.filter((user) => user.chatId !== ctx.chat.id && user.city === city && user.interests === interests);

    if (matches.length > 0) {
        // Если найдены совпадения, отправляем сообщение об этом
        matches.forEach(match => {
            ctx.reply(`У вас есть общий интерес с пользователем! Ваш город: ${city}, Интересы: ${interests}.`);
            bot.telegram.sendMessage(match.chatId, `У вас есть общий интерес с пользователем! Ваш город: ${city}, Интересы: ${interests}.`);
        });
    } else {
        await ctx.reply("Спасибо! Мы сохранили ваши интересы.");
    }
});
// Обработайте другие сообщения.
bot.on("message", (ctx) => ctx.reply("Получил ваше сообщение: " + ctx.message.text + " !",));

// Клавиатура будет отправлять в бота команду /about
const keyboard = new InlineKeyboard()
    .text("Обо мне", "/about");

bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.answerCallbackQuery(); // Уведомляем Telegram, что мы обработали запрос
await ctx.reply("Я бот? Я бот... Я Бот!");
});

// Запуск бота
bot.start();
console.log('Бот запущен!');


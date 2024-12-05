import { Bot, InlineKeyboard } from "https://deno.land/x/grammy@v1.32.0/mod.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

interface UserInfo {
    chatId: number;
    interests: string;
    city: string;
}

const users: UserInfo[] = []; // Массив для хранения пользователей

// Клавиатура будет отправлять в бота команду /about
const keyboard = new InlineKeyboard().text("Обо мне", "/about");

// Обработайте команду /start.
bot.command("start", async (ctx) => {
    await ctx.reply("Добро пожаловать. Запущен и работает!", { reply_markup: keyboard });
    await ctx.reply("Напишите свои интересы и город в формате: 'интересы, город'");
});

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

bot.callbackQuery("/about", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply("Я бот? Я бот... Я Бот!");
});

// Запуск бота
bot.start();
console.log('Бот запущен!');


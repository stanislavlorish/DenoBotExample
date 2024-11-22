import express, { Request, Response } from 'express';
import { webhookCallback } from "https://deno.land/x/grammy@v1.32.0/mod.ts";
import { bot } from "./lib/bot.ts";

const app = express();

const handleUpdate = webhookCallback(bot, 'express');

app.use(express.json());

app.post(async (req: Request, res: Response) => {
    const urlPath = req.path.slice(1); // Получаем путь URL, исключая начальный слэш

    if (req.method === "POST" && urlPath === bot.token) {
        try {
            await handleUpdate(req, res); // Передаем запрос и ответ в обработчик обновлений
        } catch (err) {
            console.error(err);
            res.sendStatus(500); // Ответ с ошибкой
        }
    } else {
        res.sendStatus(404); // Если путь не соответствует токену бота или метод не POST
    }
});

// Слушаем на порту 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

// توکن ربات از BotFather
const token = "8017722268:AAHuASniFICogcWBTofmkpVlgus95QiZtbc";
const bot = new TelegramBot(token, { Webhook: true });

// فایل محصولات
let products = JSON.parse(fs.readFileSync("products.json", "utf8"));

// شروع
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "سلام 👋 به فروشگاه خوش اومدی!\nبرای دیدن محصولات /shop رو بزن.");
});

// نمایش محصولات
bot.onText(/\/shop/, (msg) => {
  const chatId = msg.chat.id;

  const buttons = products.map(p => ([{
    text: `${p.title} – ${p.price.toLocaleString()} تومان`,
    callback_data: `buy_${p.id}`
  }]));

  bot.sendMessage(chatId, "📦 محصولات موجود:", {
    reply_markup: {
      inline_keyboard: buttons
    }
  });
});

// خرید
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data.startsWith("buy_")) {
    const productId = parseInt(data.split("_")[1]);
    const product = products.find(p => p.id === productId);

    if (product) {
      bot.sendMessage(chatId,
        `✅ شما انتخاب کردید:\n${product.title}\nقیمت: ${product.price.toLocaleString()} تومان\n\nبرای پرداخت روی دکمه زیر کلیک کن:`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "💳 پرداخت", url: `https://your-payment.com/pay?id=${productId}` }]
            ]
          }
        }
      );
    }
  }
});

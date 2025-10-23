from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
import os
import json

# Токен бота от @BotFather
BOT_TOKEN = ""

# URL твоего Mini App (после загрузки на хостинг)
MINI_APP_URL = "https://your-username.github.io/school-organizer"  # Пример для GitHub Pages

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /start"""
    keyboard = [
        [InlineKeyboardButton("📚 Открыть школьный органайзер", web_app={"url": MINI_APP_URL})]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🎓 *Добро пожаловать в умный школьный органайзер!*\n\n"
        "Здесь ты можешь удобно вести:\n"
        "• 📅 Расписание уроков\n"
        "• 📝 Домашние задания\n" 
        "• ⏰ Дедлайны и напоминания\n"
        "• 📊 Оценки и средний балл\n"
        "• 🎂 Дни рождения друзей\n"
        "• 🎉 Каникулы и отсчет времени\n\n"
        "Нажми кнопку ниже чтобы начать!",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /help"""
    help_text = """
🤖 *Команды бота:*

/start - Запустить органайзер
/help - Показать эту справку

📱 *Как использовать:*

1. Нажми кнопку «Открыть школьный органайзер»
2. Разреши открытие Mini App
3. Начни добавлять свои данные!

💡 *Советы:*
• Все данные сохраняются в твоем браузере
• Ты можешь добавить бота в избранное
• Органайзер работает даже без интернета
    """
    
    await update.message.reply_text(help_text, parse_mode='Markdown')

def main():
    """Запуск бота"""
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Добавляем обработчики команд
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    
    # Запускаем бота
    print("Бот запущен...")
    application.run_polling()

if __name__ == "__main__":

    main()

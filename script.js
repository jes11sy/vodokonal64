// ============================================
// Telegram Bot Configuration
// ============================================
// Конфигурация загружается из config.js
const TELEGRAM_BOT_TOKEN = CONFIG.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = CONFIG.TELEGRAM_CHAT_ID;

// Функция форматирования сообщения
function formatMessage(formData) {
    let message = `🔔 <b>Новая заявка с Водоканал64 (Саратов)</b>\n\n`;
    message += `👤 <b>Имя:</b> ${formData.name || 'Не указано'}\n`;
    message += `📞 <b>Телефон:</b> ${formData.phone || 'Не указано'}\n`;
    message += `📋 <b>Тип заявки:</b> ${formData.type || 'Не указано'}\n`;
    message += `\n⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;
    
    return message;
}

// Функция отправки в Telegram
async function sendToTelegram(formData) {
    const message = formatMessage(formData);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ Заявка отправлена в Telegram');
            return true;
        } else {
            console.error('❌ Ошибка отправки в Telegram:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка при отправке в Telegram:', error);
        return false;
    }
}

// Обработка форм
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.ajax_form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: form.querySelector('[name="name"]').value,
                phone: form.querySelector('[name="phone"]').value,
                type: form.querySelector('[name="pagetitle"]').value
            };
            
            console.log('Заявка отправлена:', formData);
            
            // Отправка в Telegram
            const sent = await sendToTelegram(formData);
            
            if (sent) {
                // Перенаправление на страницу благодарности
                window.location.href = 'thanks.html';
            } else {
                alert('Произошла ошибка при отправке заявки. Пожалуйста, позвоните нам по телефону.');
            }
        });
    });
});


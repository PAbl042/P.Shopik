// ===== НАСТРОЙКИ =====
const BOT_TOKEN = '8450951119:AAHwnFXdq6RHuhuYygvB9VqeVqISInA7G54';
const CHAT_ID = 1652142639;
// ====================

let selectedProduct = null;
const products = [
    { id: 1, name: "Blitz Pulse Pro", price: "4 990 ₽", color: "#ff6b6b" },
    { id: 2, name: "Nexus Beat Over-Ear", price: "6 490 ₽", color: "#26a5e4" },
    { id: 3, name: "Aero True Wireless", price: "3 790 ₽", color: "#ffd166" },
    { id: 4, name: "Vintage Sound Classic", price: "8 990 ₽", color: "#9d4edd" }
];

// ===== ЗАГРУЗКА САЙТА =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Сайт загружен');
    renderProducts();
    setupCloseButton();
    setupForm();
});

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

// 1. Показать товары
function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img" style="background: ${product.color};">
                <i class="fas fa-headphones"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">Качественные наушники с отличным звуком</p>
                <div class="product-price">${product.price}</div>
                <button class="select-btn" onclick="selectProduct(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Выбрать для заказа
                </button>
            </div>
        </div>
    `).join('');
}

// 2. Закрытие промо-окна
function setupCloseButton() {
    const closeBtn = document.getElementById('closePromo');
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById('tgPromo').style.display = 'none';
        };
    }
}

// 3. Настройка формы
function setupForm() {
    const form = document.getElementById('orderForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            sendOrder();
        };
    }
}

// 4. Выбор товара (глобальная функция)
window.selectProduct = function(productId) {
    selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
        const nameElement = document.getElementById('selectedProductName');
        if (nameElement) {
            nameElement.textContent = selectedProduct.name;
            console.log('✅ Выбран товар:', selectedProduct.name);
        }
        
        // Прокрутка к форме
        setTimeout(() => {
            const formSection = document.getElementById('contact');
            if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
};

// 5. ОТПРАВКА ЗАКАЗА (ИСПРАВЛЕННАЯ ВЕРСИЯ)
async function sendOrder() {
    console.log('🔄 Начинаем отправку...');
    
    // Проверка товара
    if (!selectedProduct) {
        alert('❌ Сначала выберите товар!');
        return;
    }
    
    // ПРОСТОЙ ПОИСК ПОЛЕЙ ФОРМЫ (без сложных проверок)
    const nameValue = document.querySelector('input[id="name"]')?.value || 
                     document.querySelector('#name')?.value || '';
    
    const contactValue = document.querySelector('input[id="contact"]')?.value || 
                        document.querySelector('#contact')?.value || '';
    
    const messageValue = document.querySelector('textarea[id="message"]')?.value || 
                        document.querySelector('#message')?.value || '';
    
    console.log('Найдены значения:', { 
        name: nameValue, 
        contact: contactValue, 
        message: messageValue 
    });
    
    // Проверка заполнения
    if (!nameValue.trim() || !contactValue.trim()) {
        alert('❌ Заполните имя и контакты!');
        return;
    }
    
    // Текст заказа
    const orderText = `🛒 НОВЫЙ ЗАКАЗ P.Shopik\n` +
                     `——————————————\n` +
                     `Товар: ${selectedProduct.name}\n` +
                     `Цена: ${selectedProduct.price}\n` +
                     `——————————————\n` +
                     `Клиент: ${nameValue.trim()}\n` +
                     `Контакты: ${contactValue.trim()}\n` +
                     `Комментарий: ${messageValue.trim() || '—'}\n` +
                     `——————————————\n` +
                     `Время: ${new Date().toLocaleString('ru-RU')}`;
    
    console.log('📤 Отправляем в Telegram...');
    
    // Кнопка загрузки
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = '⌛ Отправка...';
        submitBtn.disabled = true;
    }
    
    try {
        // Отправка через API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: orderText
            })
        });
        
        const data = await response.json();
        console.log('📥 Ответ Telegram:', data);
        
        if (data.ok) {
            // УСПЕХ
            alert('✅ Заказ отправлен! Проверьте Telegram!');
            
            // Очистка формы
            document.getElementById('orderForm').reset();
            selectedProduct = null;
            document.getElementById('selectedProductName').textContent = '—';
            
            console.log('🎉 Заказ успешно отправлен!');
        } else {
            // ОШИБКА
            console.error('❌ Ошибка Telegram:', data);
            alert(`❌ Ошибка: ${data.description || 'Неизвестная ошибка'}\n\nПишите: @P_Shop1k`);
        }
    } catch (error) {
        // СЕТЕВАЯ ОШИБКА
        console.error('❌ Сетевая ошибка:', error);
        alert('❌ Проблемы с интернетом. Пишите: @P_Shop1k');
    } finally {
        // Восстановление кнопки
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fab fa-telegram"></i> Отправить заказ в Telegram';
            submitBtn.disabled = false;
        }
    }
}

// ===== ТЕСТОВЫЕ ФУНКЦИИ =====

// Быстрый тест
window.quickTest = function() {
    console.log('⚡ Быстрый тест...');
    selectProduct(1);
    
    // Заполняем поля (если они есть)
    const nameInput = document.querySelector('#name');
    const contactInput = document.querySelector('#contact');
    
    if (nameInput) nameInput.value = 'Тест Имя';
    if (contactInput) contactInput.value = '@test_user';
    
    console.log('✅ Готово к отправке!');
};

// Проверка элементов
window.checkForm = function() {
    console.log('🔍 Проверяем форму:');
    
    // Все возможные способы найти поля
    const fields = [
        { name: 'name', elem: document.getElementById('name') },
        { name: 'contact', elem: document.getElementById('contact') },
        { name: 'message', elem: document.getElementById('message') },
        { name: 'name (query)', elem: document.querySelector('#name') },
        { name: 'contact (query)', elem: document.querySelector('#contact') },
        { name: 'message (query)', elem: document.querySelector('#message') },
        { name: 'name input[id]', elem: document.querySelector('input[id="name"]') },
        { name: 'contact input[id]', elem: document.querySelector('input[id="contact"]') }
    ];
    
    fields.forEach(field => {
        console.log(`${field.name}:`, field.elem);
    });
};

// Прямая проверка Telegram
window.testTelegram = function() {
    console.log('🧪 Тест Telegram API...');
    
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: '🔧 Тестовое сообщение от сайта P.Shopik'
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.ok) {
            console.log('✅ Тест успешен! Сообщение отправлено в Telegram.');
            alert('✅ Тест успешен! Проверьте Telegram.');
        } else {
            console.log('❌ Ошибка:', data);
            alert('❌ Ошибка: ' + data.description);
        }
    })
    .catch(e => {
        console.error('❌ Сетевая ошибка:', e);
        alert('❌ Сетевая ошибка');
    });
};
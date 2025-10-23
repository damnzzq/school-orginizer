// Основной объект данных
let appData = {
    schedule: {
        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: []
    },
    homework: [],
    deadlines: [],
    grades: [],
    birthdays: [],
    holidays: [],
    settings: {
        currentHoliday: null
    }
};

// Текущий выбранный день для расписания
let currentDay = 'monday';
let selectedGrade = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadData();
    initTabs();
    initDayTabs();
    initGradeButtons();
    updateUI();
    startCountdownTimer();
    
    // Обновляем UI каждую минуту для актуальных данных
    setInterval(updateUI, 60000);
}

// Загрузка данных из localStorage
function loadData() {
    const saved = localStorage.getItem('schoolOrganizerData');
    if (saved) {
        appData = JSON.parse(saved);
    }
    
    // Добавляем демо-данные если пусто
    if (appData.homework.length === 0) {
        addDemoData();
    }
}

// Сохранение данных в localStorage
function saveData() {
    localStorage.setItem('schoolOrganizerData', JSON.stringify(appData));
    updateUI();
}

// Демо-данные для примера
function addDemoData() {
    appData.homework = [
        {
            id: 1,
            subject: "Литература",
            task: "Прочитать 'Горе от ума'",
            deadline: getDateString(3),
            priority: "high",
            done: false
        }
    ];
    
    appData.deadlines = [
        {
            id: 1,
            title: "Выучить стих Есенина",
            description: "Стихотворение 'Берёза'",
            date: getDateString(2),
            type: "poem"
        }
    ];
    
    appData.grades = [
        { id: 1, subject: "Математика", grade: 5, date: getDateString(-1) },
        { id: 2, subject: "Математика", grade: 4, date: getDateString(-2) }
    ];
    
    appData.birthdays = [
        { id: 1, name: "Мария Иванова", date: "2024-06-15" }
    ];
    
    appData.holidays = [
        { 
            id: 1, 
            name: "Весенние каникулы", 
            start: "2024-03-25", 
            end: "2024-04-01" 
        }
    ];
    
    saveData();
}
function initApp() {
    loadData();
    initTabs();
    initDayTabs();
    initGradeButtons();
    initMobileMenu(); // Новая функция для мобильного меню
    updateUI();
    startCountdownTimer();
    
    setInterval(updateUI, 60000);
}

// Новая функция для мобильного меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const tabsNav = document.getElementById('tabsNav');
    
    if (menuToggle && tabsNav) {
        menuToggle.addEventListener('click', function() {
            tabsNav.classList.toggle('active');
            // Анимация бургер-меню
            this.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    tabsNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768 && 
                !tabsNav.contains(event.target) && 
                !menuToggle.contains(event.target) &&
                tabsNav.classList.contains('active')) {
                tabsNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// Функция для быстрого добавления оценок
function addQuickGrade() {
    const subject = document.getElementById('quickSubject').value;
    const activeBtn = document.querySelector('.quick-grade-btn.active');
    
    if (subject && activeBtn) {
        const grade = parseInt(activeBtn.dataset.grade);
        const date = new Date().toISOString().split('T')[0];
        
        appData.grades.push({
            id: Date.now(),
            subject,
            grade,
            date
        });
        
        saveData();
        document.getElementById('quickSubject').value = '';
        document.querySelectorAll('.quick-grade-btn').forEach(btn => btn.classList.remove('active'));
        
        // Показать уведомление об успехе
        showNotification(`Оценка ${grade} по предмету "${subject}" добавлена!`);
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Добавляем стили для анимации уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }
    
    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }
`;
document.head.appendChild(style);

// Инициализация быстрых кнопок оценок
function initQuickGradeButtons() {
    document.querySelectorAll('.quick-grade-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.quick-grade-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Обнови вызов в initApp()
function initApp() {
    loadData();
    initTabs();
    initDayTabs();
    initGradeButtons();
    initQuickGradeButtons(); // Добавляем эту строку
    initMobileMenu();
    updateUI();
    startCountdownTimer();
    
    setInterval(updateUI, 60000);
}
// Инициализация вкладок
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            // Активируем текущую
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Инициализация вкладок дней
function initDayTabs() {
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentDay = this.dataset.day;
            renderSchedule();
        });
    });
}

// Инициализация кнопок оценок
function initGradeButtons() {
    document.querySelectorAll('.grade-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedGrade = parseInt(this.dataset.grade);
        });
    });
}

// Обновление всего интерфейса
function updateUI() {
    updateDate();
    updateHolidayStatus();
    renderSchedule();
    renderHomework();
    renderDeadlines();
    renderGrades();
    renderBirthdays();
    renderHolidays();
    updateCountdown();
}

// Обновление даты
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ru-RU', options);
}

// Обновление статуса каникул
function updateHolidayStatus() {
    const statusElement = document.getElementById('holidayStatus');
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const currentHoliday = appData.holidays.find(holiday => 
        today >= holiday.start && today <= holiday.end
    );
    
    if (currentHoliday) {
        statusElement.textContent = `🎉 ${currentHoliday.name}`;
        statusElement.style.background = 'rgba(34, 197, 94, 0.3)';
    } else {
        statusElement.textContent = '📚 Учебное время';
        statusElement.style.background = 'rgba(255, 255, 255, 0.2)';
    }
}

// === РЕНДЕРИНГ РАЗЛИЧНЫХ СЕКЦИЙ ===

// Рендеринг расписания
function renderSchedule() {
    const container = document.getElementById('schedule-content');
    const lessons = appData.schedule[currentDay] || [];
    
    if (lessons.length === 0) {
        container.innerHTML = `
            <div class="card text-center">
                <div style="color: var(--gray); padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📚</div>
                    <div>Нет уроков на этот день</div>
                    <button onclick="showAddLessonModal()" class="btn-primary mt-4">Добавить первый урок</button>
                </div>
            </div>
        `;
        return;
    }
    
    const html = lessons.map(lesson => `
        <div class="card">
            <div class="card-header">
                <div class="card-title">${lesson.subject}</div>
                <div class="card-time">${lesson.time}</div>
            </div>
            <div class="card-actions">
                <button onclick="deleteLesson('${currentDay}', ${lessons.indexOf(lesson)})" 
                        class="btn-small btn-danger">Удалить</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Рендеринг домашних заданий
function renderHomework() {
    const container = document.getElementById('homework-list');
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const homework = appData.homework
        .filter(hw => !hw.done)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    if (homework.length === 0) {
        container.innerHTML = '<div class="card text-center">Нет активных заданий</div>';
        return;
    }
    
    const html = homework.map(hw => {
        const daysLeft = Math.ceil((new Date(hw.deadline) - now) / (1000 * 60 * 60 * 24));
        let dateText = formatDate(hw.deadline);
        
        if (daysLeft === 0) dateText = '⏰ Сегодня!';
        else if (daysLeft === 1) dateText = 'Завтра';
        else if (daysLeft < 0) dateText = '❌ Просрочено';
        else dateText = `Через ${daysLeft} дней`;
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${hw.subject}</div>
                    <div class="card-priority priority-${hw.priority}">
                        ${hw.priority === 'high' ? 'Высокий' : hw.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </div>
                </div>
                <div class="card-desc">${hw.task}</div>
                <div class="card-date">${dateText}</div>
                <div class="card-actions">
                    <button onclick="completeHomework(${hw.id})" class="btn-small" 
                            style="background: var(--success); color: white;">Выполнено</button>
                    <button onclick="deleteHomework(${hw.id})" class="btn-small btn-danger">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Рендеринг дедлайнов
function renderDeadlines() {
    const container = document.getElementById('deadlines-list');
    const now = new Date();
    
    const deadlines = appData.deadlines
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (deadlines.length === 0) {
        container.innerHTML = '<div class="card text-center">Нет активных дедлайнов</div>';
        return;
    }
    
    const html = deadlines.map(deadline => {
        const daysLeft = Math.ceil((new Date(deadline.date) - now) / (1000 * 60 * 60 * 24));
        let dateText = formatDate(deadline.date);
        
        if (daysLeft === 0) dateText = '⏰ Сегодня!';
        else if (daysLeft === 1) dateText = 'Завтра';
        else if (daysLeft < 0) dateText = '❌ Просрочено';
        else dateText = `Через ${daysLeft} дней`;
        
        const typeIcons = {
            poem: '📖',
            project: '📁', 
            test: '📝',
            other: '📌'
        };
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${typeIcons[deadline.type]} ${deadline.title}</div>
                </div>
                <div class="card-desc">${deadline.description}</div>
                <div class="card-date">${dateText}</div>
                <div class="card-actions">
                    <button onclick="deleteDeadline(${deadline.id})" class="btn-small btn-danger">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Рендеринг оценок
function renderGrades() {
    updateAverageGrade();
    renderSubjectsGrades();
}

// Обновление среднего балла
function updateAverageGrade() {
    const allGrades = appData.grades.map(g => g.grade);
    const average = allGrades.length > 0 ? 
        (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(1) : '0.0';
    
    document.getElementById('averageGrade').textContent = average;
}

// Рендеринг оценок по предметам
function renderSubjectsGrades() {
    const container = document.getElementById('subjects-list');
    
    // Группируем оценки по предметам
    const subjects = {};
    appData.grades.forEach(grade => {
        if (!subjects[grade.subject]) {
            subjects[grade.subject] = [];
        }
        subjects[grade.subject].push(grade);
    });
    
    if (Object.keys(subjects).length === 0) {
        container.innerHTML = '<div class="card text-center">Нет оценок</div>';
        return;
    }
    
    const html = Object.entries(subjects).map(([subject, grades]) => {
        const subjectAverage = (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(1);
        const gradesHtml = grades.map(grade => `
            <div class="grade-badge grade-${grade.grade}">${grade.grade}</div>
        `).join('');
        
        return `
            <div class="subject-card">
                <div class="subject-header">
                    <div class="subject-name">${subject}</div>
                    <div class="subject-avg">${subjectAverage}</div>
                </div>
                <div class="grades-list">${gradesHtml}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Рендеринг дней рождений
function renderBirthdays() {
    const container = document.getElementById('birthdays-list');
    const now = new Date();
    const currentYear = now.getFullYear();
    
    const birthdays = appData.birthdays
        .map(bd => {
            const bdDate = new Date(bd.date);
            const nextBirthday = new Date(currentYear, bdDate.getMonth(), bdDate.getDate());
            if (nextBirthday < now) {
                nextBirthday.setFullYear(currentYear + 1);
            }
            return {
                ...bd,
                daysUntil: Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24))
            };
        })
        .sort((a, b) => a.daysUntil - b.daysUntil);
    
    if (birthdays.length === 0) {
        container.innerHTML = '<div class="card text-center">Нет дней рождений</div>';
        return;
    }
    
    const html = birthdays.map(bd => {
        let daysText = '';
        if (bd.daysUntil === 0) daysText = '🎉 Сегодня!';
        else if (bd.daysUntil === 1) daysText = 'Завтра';
        else daysText = `Через ${bd.daysUntil} дней`;
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">🎂 ${bd.name}</div>
                </div>
                <div class="card-date">${formatDate(bd.date)} • ${daysText}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Рендеринг каникул
function renderHolidays() {
    const container = document.getElementById('holidays-list');
    const now = new Date();
    
    const holidays = appData.holidays
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    if (holidays.length === 0) {
        container.innerHTML = '<div class="card text-center">Нет добавленных каникул</div>';
        return;
    }
    
    const html = holidays.map(holiday => {
        const isActive = now >= new Date(holiday.start) && now <= new Date(holiday.end);
        const status = isActive ? '🎉 Сейчас' : now < new Date(holiday.start) ? '📅 Будущие' : '✅ Прошедшие';
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">${holiday.name}</div>
                    <div style="color: var(--gray); font-size: 14px;">${status}</div>
                </div>
                <div class="card-date">
                    ${formatDate(holiday.start)} - ${formatDate(holiday.end)}
                </div>
                <div class="card-actions">
                    <button onclick="deleteHoliday(${holiday.id})" class="btn-small btn-danger">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// === ФУНКЦИИ ДОБАВЛЕНИЯ ДАННЫХ ===

// Уроки
function showAddLessonModal() {
    document.getElementById('lessonModal').style.display = 'block';
}

function saveLesson() {
    const subject = document.getElementById('lessonSubject').value;
    const time = document.getElementById('lessonTime').value;
    const day = document.getElementById('lessonDay').value;
    
    if (subject && time) {
        if (!appData.schedule[day]) appData.schedule[day] = [];
        
        appData.schedule[day].push({
            id: Date.now(),
            subject,
            time
        });
        
        saveData();
        closeModal('lessonModal');
        if (day === currentDay) renderSchedule();
    }
}

// Домашние задания
function showAddHomeworkModal() {
    document.getElementById('homeworkModal').style.display = 'block';
}

function saveHomework() {
    const subject = document.getElementById('hwSubject').value;
    const task = document.getElementById('hwTask').value;
    const deadline = document.getElementById('hwDeadline').value;
    const priority = document.getElementById('hwPriority').value;
    
    if (subject && task && deadline) {
        appData.homework.push({
            id: Date.now(),
            subject,
            task,
            deadline,
            priority,
            done: false
        });
        
        saveData();
        closeModal('homeworkModal');
    }
}

function completeHomework(id) {
    const homework = appData.homework.find(hw => hw.id === id);
    if (homework) {
        homework.done = true;
        saveData();
    }
}

// Дедлайны
function showAddDeadlineModal() {
    document.getElementById('deadlineModal').style.display = 'block';
}

function saveDeadline() {
    const title = document.getElementById('deadlineTitle').value;
    const description = document.getElementById('deadlineDesc').value;
    const date = document.getElementById('deadlineDate').value;
    const type = document.getElementById('deadlineType').value;
    
    if (title && date) {
        appData.deadlines.push({
            id: Date.now(),
            title,
            description,
            date,
            type
        });
        
        saveData();
        closeModal('deadlineModal');
    }
}

// Оценки
function showAddGradeModal() {
    selectedGrade = null;
    document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('gradeDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('gradeModal').style.display = 'block';
}

function saveGrade() {
    const subject = document.getElementById('gradeSubject').value;
    const date = document.getElementById('gradeDate').value;
    
    if (subject && selectedGrade !== null) {
        appData.grades.push({
            id: Date.now(),
            subject,
            grade: selectedGrade,
            date
        });
        
        saveData();
        closeModal('gradeModal');
    }
}

// Дни рождения
function showAddBirthdayModal() {
    document.getElementById('birthdayModal').style.display = 'block';
}

function saveBirthday() {
    const name = document.getElementById('birthdayName').value;
    const date = document.getElementById('birthdayDate').value;
    
    if (name && date) {
        appData.birthdays.push({
            id: Date.now(),
            name,
            date
        });
        
        saveData();
        closeModal('birthdayModal');
    }
}

// Каникулы
function showAddHolidayModal() {
    document.getElementById('holidayModal').style.display = 'block';
}

function saveHoliday() {
    const name = document.getElementById('holidayName').value;
    const start = document.getElementById('holidayStart').value;
    const end = document.getElementById('holidayEnd').value;
    
    if (name && start && end) {
        appData.holidays.push({
            id: Date.now(),
            name,
            start,
            end
        });
        
        saveData();
        closeModal('holidayModal');
    }
}

// === ФУНКЦИИ УДАЛЕНИЯ ===

function deleteLesson(day, index) {
    if (confirm('Удалить этот урок?')) {
        appData.schedule[day].splice(index, 1);
        saveData();
    }
}

function deleteHomework(id) {
    if (confirm('Удалить это задание?')) {
        appData.homework = appData.homework.filter(hw => hw.id !== id);
        saveData();
    }
}

function deleteDeadline(id) {
    if (confirm('Удалить этот дедлайн?')) {
        appData.deadlines = appData.deadlines.filter(d => d.id !== id);
        saveData();
    }
}

function deleteHoliday(id) {
    if (confirm('Удалить эти каникулы?')) {
        appData.holidays = appData.holidays.filter(h => h.id !== id);
        saveData();
    }
}

// === ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ===

function startCountdownTimer() {
    updateCountdown();
    setInterval(updateCountdown, 60000); // Обновлять каждую минуту
}

function updateCountdown() {
    const container = document.getElementById('countdown-timer');
    const now = new Date();
    
    // Находим ближайшие будущие каникулы
    const futureHolidays = appData.holidays
        .filter(h => new Date(h.start) > now)
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    if (futureHolidays.length === 0) {
        container.innerHTML = '<div class="text-center" style="color: var(--gray);">Нет данных о каникулах</div>';
        return;
    }
    
    const nextHoliday = futureHolidays[0];
    const timeDiff = new Date(nextHoliday.start) - now;
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    container.innerHTML = `
        <div class="countdown-item">
            <div class="countdown-number">${days}</div>
            <div class="countdown-label">дней</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number">${hours}</div>
            <div class="countdown-label">часов</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-number">${minutes}</div>
            <div class="countdown-label">минут</div>
        </div>
    `;
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Очищаем поля
    document.querySelectorAll(`#${modalId} .input-field`).forEach(field => {
        if (field.type !== 'date') field.value = '';
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long' 
    });
}

function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

// Закрытие модальных окон при клике вне их
window.addEventListener('click', function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

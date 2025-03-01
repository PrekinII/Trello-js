class Trello {
    constructor() {
        this.columns = [
            { id: 1, title: 'TODO', cards: [] },
            { id: 2, title: 'IN PROGRESS', cards: [] },
            { id: 3, title: 'DONE', cards: [] },
        ];

        this.draggedCard = null;
        this.draggedCardColumnId = null; 
        this.draggedCardIndex = null; 
    }

    init() {
        localStorage.removeItem('trelloState'); // Очищаем LocalStorage (в целом можно убрать)
        this.loadState(); // Загружаем состояние из LocalStorage
        this.renderColumns(); // Отрисовываем колонки и карточки
    }

    // Jnhbcjdrf rjkjyjr b rfhnjxtr
    renderColumns() {
        const app = document.getElementById('app');
        app.innerHTML = '';

        this.columns.forEach((column) => {
            const columnElement = document.createElement('div');
            columnElement.className = 'column';
            columnElement.innerHTML = `
                <h2>${column.title}</h2>
                <div class="cards" data-column-id="${column.id}"></div>
                <button class="add-card" data-column-id="${column.id}">+ Add another card</button>
            `;

            // Находим контейнер для карточек внутри колонки
            const cardsContainer = columnElement.querySelector('.cards');

            // Добавляем карточки в контейнер
            column.cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.draggable = true; // Делаем карточку перетаскиваемой
                cardElement.dataset.columnId = column.id; // Сохраняем ID колонки
                cardElement.dataset.cardIndex = index; // Сохраняем индекс карточки
                cardElement.innerHTML = `${card} <span class="delete-card" data-column-id="${column.id}" data-card-index="${index}">&times;</span>`;
                cardsContainer.appendChild(cardElement); // Добавляем карточку в контейнер
            });

            app.appendChild(columnElement); // Добавляем колонку в приложение
        });

        this.addEventListeners(); // Добавляем обработчики событий
    }

    // Добавление обработчиков событий
    addEventListeners() {
        // Добавление карточки
        document.querySelectorAll('.add-card').forEach((button) => {
            button.addEventListener('click', () => {
                const columnId = button.dataset.columnId; // Получаем ID rjkjyrb
                const cardText = prompt('Enter card text:'); // Запрашиваем текст карточки
                if (cardText) {
                    // Добавляем карточку в соответствующую колонку
                    this.columns.find(col => col.id == columnId).cards.push(cardText);
                    this.renderColumns(); // Перерисовываем колонки
                    this.saveState(); // Сохраняем состояние
                }
            });
        });

        // Удаление карточки
        document.querySelectorAll('.delete-card').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Останавливаем всплытие события
                const columnId = button.dataset.columnId; // Получаем ID колонки
                const cardIndex = button.dataset.cardIndex; // Получаем индекс карточки
                // Удаляем карточку из колонки
                this.columns.find(col => col.id == columnId).cards.splice(cardIndex, 1);
                this.renderColumns(); // Перерисовываем колонки
                this.saveState(); // Сохраняем состояние
            });
        });

        // Перетаскивание карточек
        document.querySelectorAll('.card').forEach((card) => {
            card.addEventListener('dragstart', this.handleDragStart.bind(this)); // Начало перетаскивания
            card.addEventListener('dragend', this.handleDragEnd.bind(this)); // Конец перетаскивания
        });

        // Разрешаем перетаскивание в колонки
        document.querySelectorAll('.cards').forEach((cardsContainer) => {
            cardsContainer.addEventListener('dragover', this.handleDragOver.bind(this)); // Разрешение перетаскивания
            cardsContainer.addEventListener('dragenter', this.handleDragEnter.bind(this)); // Подсветка при наведении
            cardsContainer.addEventListener('dragleave', this.handleDragLeave.bind(this)); // Убираем подсветку
            cardsContainer.addEventListener('drop', this.handleDrop.bind(this)); // Обработка отпускания карточки
        });
    }

    // Начинаем тащить карточку
    handleDragStart(event) {
        this.draggedCard = event.target; // Сохраняем перетаскиваемую карточку
        this.draggedCardColumnId = event.target.dataset.columnId; // Сохраняем ID колонки
        this.draggedCardIndex = event.target.dataset.cardIndex; // Сохраняем индекс карточки
        event.target.classList.add('dragging'); // Добавляем класс для стилизации
    }

    // Разрешение перетаскивания
    handleDragOver(event) {
        event.preventDefault(); // Разрешаем перетаскивание
    }

    // Подсветка колонки при наведении
    handleDragEnter(event) {
        const targetColumn = event.currentTarget;
        targetColumn.classList.add('dragover'); // Добавляем класс для подсветки
    }

    // Убираем подсветку при уходе карточки
    handleDragLeave(event) {
        const targetColumn = event.currentTarget;
        targetColumn.classList.remove('dragover'); // Убираем класс подсветки
    }

    // Отпускаем карточку
    handleDrop(event) {
        event.preventDefault(); 
        const targetColumn = event.currentTarget;
        targetColumn.classList.remove('dragover'); // Убираем подсветку

        if (targetColumn && this.draggedCard) {
            const newColumnId = targetColumn.dataset.columnId; // Получаем ID новой колонки

            // Удаляем карточку из старой колонки
            const oldColumn = this.columns.find(col => col.id == this.draggedCardColumnId);
            const cardText = oldColumn.cards.splice(this.draggedCardIndex, 1)[0];

            // Добавляем карточку в новую колонку
            const newColumn = this.columns.find(col => col.id == newColumnId);
            newColumn.cards.push(cardText);

            this.renderColumns(); // Перерисовываем колонки
            this.saveState(); // Сохраняем состояние
        }
    }

    // Завершение перетаскивания
    handleDragEnd(event) {
        event.target.classList.remove('dragging'); // Убираем класс для стилизации
        this.draggedCard = null; // Сбрасываем данные о перетаскиваемой карточке
        this.draggedCardColumnId = null;
        this.draggedCardIndex = null;
    }

    // Сохранение состояния в LocalStorage
    saveState() {
        localStorage.setItem('trelloState', JSON.stringify(this.columns)); // Сохраняем колонки
    }

    // Загрузка состояния из LocalStorage
    loadState() {
        const state = localStorage.getItem('trelloState'); // Получаем состояние
        if (state) {
            this.columns = JSON.parse(state); // Восстанавливаем колонки
        }
    }
}

export default Trello; // Экспорт класса
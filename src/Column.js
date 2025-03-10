import Card from "./Card";

class Column {
  constructor(id, title, cards = []) {
    this.id = id; // ID колонки
    this.title = title; // Заголовок колонки
    this.cards = cards.map(
      (cardText, index) => new Card(cardText, this.id, index),
    );
    this.element = this.render(); // Элемент колонки
    this.cardsContainer = this.element.querySelector(".cards"); // Контейнер для карточек
    this.addCardButton = this.element.querySelector(".add-card"); // Кнопка добавления карточки
    this.form = this.createForm(); // Форма для добавления карточек
    this.element.appendChild(this.form); // Добавляем форму в колонку
    this.addFormListeners(); // Добавляем обработчики для формы
  }

  // Отрисовка колонки
  render() {
    const columnElement = document.createElement("div");
    columnElement.classList.add("column");
    columnElement.innerHTML = `
            <h2>${this.title}</h2>
            <div class="cards" data-column-id="${this.id}"></div>
            <button class="add-card" data-column-id="${this.id}">+ Add another card</button>
        `;
    this.cards.forEach((card) => {
      columnElement.querySelector(".cards").appendChild(card.element); // Добавляем карточки
    });
    return columnElement;
  }

  // Создание формы для добавления карточек
  createForm() {
    const form = document.createElement("form");
    form.className = "form-field";
    form.innerHTML = `
            <textarea placeholder="Enter card text..." rows="3"></textarea>
            <div class="form-btn-box">
                <button type="submit">Add</button>
                <button type="button" class="cancel-btn">×</button>
            </div>
        `;
    form.style.display = "none"; // Скрываем форму по умолчанию
    return form;
  }

  // Добавление обработчиков для формы
  addFormListeners() {
    const textarea = this.form.querySelector("textarea");
    // const submitButton = this.form.querySelector('button[type="submit"]');
    const cancelButton = this.form.querySelector(".cancel-btn");

    // Обработчик отправки формы
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      const cardText = textarea.value.trim();
      if (cardText) {
        this.addCard(cardText); // Добавляем карточку
        this.hideForm(); // Скрываем форму
        textarea.value = ""; // Очищаем текстовое поле
      }
    });

    // Обработчик отмены
    cancelButton.addEventListener("click", () => {
      this.hideForm(); // Скрываем форму
      textarea.value = ""; // Очищаем текстовое поле
    });
  }

  showForm() {
    this.addCardButton.style.display = "none";
    this.form.style.display = "block";
  }

  hideForm() {
    this.addCardButton.style.display = "block";
    this.form.style.display = "none";
  }

  // Добавление карточки
  addCard(cardText) {
    const newCard = new Card(cardText, this.id, this.cards.length);
    this.cards.push(newCard);
    this.cardsContainer.appendChild(newCard.element);
    this.updateCardIndexes();
  }

  // Удаление карточки
  // removeCard(index) {
  //     const [removedCard] = this.cards.splice(index, 1);
  //     this.updateCardIndexes();
  //     this.renderCards();
  //     return removedCard.text;
  // }
  removeCard(cardElement) {
    this.cards = this.cards.filter((card) => card.element !== cardElement);
    cardElement.remove(); // Удаляем элемент из DOM сразу
  }

  // Отрисовка карточек
  renderCards() {
    this.cardsContainer.innerHTML = "";
    this.cards.forEach((card) => {
      this.cardsContainer.appendChild(card.element);
    });
  }

  // Обновление индексов карточек
  updateCardIndexes() {
    this.cards.forEach((card, index) => {
      card.updateIndex(index);
    });
  }
}

export default Column;

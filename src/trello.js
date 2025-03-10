import Column from "./Column";

class Trello {
  constructor() {
    this.loadState();
    this.draggedCard = null;
    this.appElement = document.getElementById("app");
    this.renderColumns();
    this.addEventListeners();
  }

  renderColumns() {
    this.appElement.innerHTML = "";
    this.columns.forEach((column) =>
      this.appElement.appendChild(column.element),
    );
  }

  addEventListeners() {
    this.appElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("add-card")) {
        const column = this.findColumnById(event.target.dataset.columnId);
        if (column) column.showForm();
      }
    });

    this.appElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-card")) {
        event.stopPropagation();
        const column = this.findColumnById(event.target.dataset.columnId);
        if (!column) return;

        const cardElement = event.target.closest(".card");
        column.removeCard(cardElement);
        this.saveState();
      }
    });

    this.appElement.addEventListener("dragstart", (event) => {
      if (event.target.classList.contains("card")) {
        this.draggedCard = event.target;
        event.target.classList.add("dragging");
      }
    });

    this.appElement.addEventListener("dragend", () => {
      if (this.draggedCard) {
        this.draggedCard.classList.remove("dragging");
        this.draggedCard = null;
      }
    });

    this.appElement.addEventListener("dragover", (event) => {
      event.preventDefault();
      const column = event.target.closest(".column");
      if (!column) return;

      const cardsContainer = column.querySelector(".cards");
      const afterElement = this.getDragAfterElement(
        cardsContainer,
        event.clientY,
      );
      if (this.draggedCard) {
        afterElement
          ? cardsContainer.insertBefore(this.draggedCard, afterElement)
          : cardsContainer.appendChild(this.draggedCard);
      }
    });

    // this.appElement.addEventListener('drop', (event) => {
    //     const column = event.target.closest('.column');
    //     if (!column || !this.draggedCard) return;

    //     const oldColumn = this.findColumnById(this.draggedCard.dataset.columnId);
    //     const newColumn = this.findColumnById(column.dataset.columnId);

    //     if (oldColumn && newColumn) {
    //         const cardText = oldColumn.removeCard(this.draggedCard.dataset.cardIndex);
    //         newColumn.addCard(cardText);
    //         this.saveState();
    //     }
    // });
    this.appElement.addEventListener("drop", (event) => {
      const column = event.target.closest(".column");
      if (!column || !this.draggedCard) return;

      const oldColumn = this.findColumnById(this.draggedCard.dataset.columnId);
      const newColumn = this.findColumnById(column.dataset.columnId);

      if (oldColumn && newColumn) {
        // Удаляем карточку из старой колонки
        oldColumn.removeCard(this.draggedCard);

        // Добавляем карточку в новую колонку
        newColumn.addCard(this.draggedCard.textContent.trim());

        this.saveState();
      }
    });
  }

  getDragAfterElement(container, y) {
    return [...container.querySelectorAll(".card:not(.dragging)")].find(
      (card) => y <= card.getBoundingClientRect().top + card.offsetHeight / 2,
    );
  }

  findColumnById(columnId) {
    return this.columns.find((col) => col.id == columnId);
  }

  saveState() {
    localStorage.setItem(
      "trelloState",
      JSON.stringify(
        this.columns.map((col) => ({
          id: col.id,
          title: col.title,
          cards: col.cards.map((card) => card.text),
        })),
      ),
    );
  }

  loadState() {
    const state = JSON.parse(localStorage.getItem("trelloState")) || [
      { id: 1, title: "TODO", cards: [] },
      { id: 2, title: "IN PROGRESS", cards: [] },
      { id: 3, title: "DONE", cards: [] },
    ];
    this.columns = state.map((col) => new Column(col.id, col.title, col.cards));
  }
}

export default Trello;

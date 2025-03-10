class Card {
  constructor(text, columnId, cardIndex) {
    this.text = text;
    this.columnId = columnId;
    this.cardIndex = cardIndex;
    this.element = this.render();
  }

  // Jnhbcjdsdftv rfhnjxre
  render() {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.draggable = true;
    cardElement.dataset.columnId = this.columnId;
    cardElement.dataset.cardIndex = this.cardIndex;
    cardElement.innerHTML = `${this.text} <span class="delete-card" data-column-id="${this.columnId}" data-card-index="${this.cardIndex}">&times;</span>`;
    return cardElement;
  }

  // Обновляем индекс
  updateIndex(newIndex) {
    this.cardIndex = newIndex;
    this.element.dataset.cardIndex = newIndex;
    this.element.querySelector(".delete-card").dataset.cardIndex = newIndex;
  }
}

export default Card;

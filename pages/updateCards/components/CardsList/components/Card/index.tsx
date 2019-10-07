import React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import "./styles.scss";

interface Props {
  card: ICardDefinition;
  selectCard: (selectedCard: ICardDefinition) => void;
  isSelected: boolean;
}

const Card = ({ card, selectCard, isSelected }: Props) => {
  const onClick = () => {
    selectCard(card);
  };

  const getShortCardQuestion = () => {
    const element = document.createElement("div");
    element.innerHTML = card.card.question;
    const text = element.innerText
      .split(" ")
      .slice(0, 10)
      .map(word => (word.length < 30 ? word : word.substr(0, 30)))
      .join(" ");
    return text.length < element.innerText.length ? `${text}...` : text;
  };

  return (
    <li
      className={isSelected ? "card card--selected" : "card"}
      onClick={onClick}
    >
      <div>{getShortCardQuestion()}</div>
      <br />
      <div>
        {card.tags.map(tag => (
          <span className="tag">{tag}</span>
        ))}
      </div>
    </li>
  );
};

export default Card;

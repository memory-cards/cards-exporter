import * as React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import "./styles.scss";

interface Props {
  card: ICardDefinition;
  selectCard: (selectedCard: string) => void;
  isSelected: boolean;
}

const Card = ({ card, selectCard, isSelected }: Props) => {
  const onClick = () => {
    // @ts-ignore
    console.log(card.fileName);
    // @ts-ignore
    selectCard(card.fileName);
  };

  const getShortCardQuestion = () => {
    const element = window.document.createElement("div");
    element.innerHTML = card.card.question;
    const text = element.innerText
      .split(" ")
      .slice(0, 10)
      .map(word => (word.length < 30 ? word : word.substr(0, 30)))
      .join(" ");
    return text.length < element.innerText.length ? `${text}...` : text;
  };

  return (
    <li className={isSelected ? "card selected" : "card"} onClick={onClick}>
      <div>{getShortCardQuestion()}</div>
      <br />
      <div>
        {card.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </li>
  );
};

export default Card;

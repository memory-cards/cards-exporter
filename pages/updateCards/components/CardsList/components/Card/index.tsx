import React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import "./styles.scss";

interface Props {
  card: ICardDefinition;
  selectCard: (selectedCard: ICardDefinition) => void;
}

const Card = ({ card, selectCard }: Props) => {
  const onClick = () => {
    selectCard(card);
  };

  return (
    <li className="card" onClick={onClick}>
      {card.tags.join(", ")}
    </li>
  );
};

export default Card;

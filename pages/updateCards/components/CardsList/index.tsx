import React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import Card from "./components/Card";

interface Props {
  cards: ICardDefinition[];
  selectCard: (selectedCard: ICardDefinition) => void;
}

const CardsList = ({ cards, selectCard }: Props) => {
  return (
    <ul>
      {cards.map(card => (
        <Card card={card} selectCard={selectCard} />
      ))}
    </ul>
  );
};

export default CardsList;

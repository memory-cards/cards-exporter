import React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import Card from "./components/Card";

interface Props {
  cards: ICardDefinition[];
  selectCard: (selectedCard: ICardDefinition) => void;
  selectedCard: ICardDefinition | null;
}

const CardsList = ({ cards, selectCard, selectedCard }: Props) => {
  return (
    <ul>
      {cards.map(card => (
        <Card
          card={card}
          selectCard={selectCard}
          isSelected={card === selectedCard}
        />
      ))}
    </ul>
  );
};

export default CardsList;

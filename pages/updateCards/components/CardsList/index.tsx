import * as React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import Card from "./components/Card";

interface Props {
  cards: ICardDefinition[];
  selectCard: (selectedCard: string) => void;
  selectedCard: string | null;
}

const CardsList = ({ cards, selectCard }: Props) => {
  return (
    <ul>
      {cards.map(card => (
        <Card
          key={card.card.question}
          card={card}
          selectCard={selectCard}
          isSelected={false}
        />
      ))}
    </ul>
  );
};

export default CardsList;

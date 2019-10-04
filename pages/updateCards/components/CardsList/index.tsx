import React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import Card from "./components/Card";

interface Props {
  cards: ICardDefinition[];
}

const CardsList = ({ cards }: Props) => {
  return (
    <ul>
      {cards.map(card => (
        <Card card={card} />
      ))}
    </ul>
  );
};

export default CardsList;

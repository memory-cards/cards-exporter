import React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import "./styles.scss";

interface Props {
  card: ICardDefinition;
}

const Card = ({ card }: Props) => {
  return <li className="card">{card.tags.join(", ")}</li>;
};

export default Card;

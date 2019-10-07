import axios from "axios";
import React, { Component } from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardPreview from "./components/CardPreview";
import CardsList from "./components/CardsList";

import "./styles.scss";

interface State {
  cards: ICardDefinition[];
  selectedCard: ICardDefinition;
}

class UpdateCardPage extends Component<State> {
  public state = {
    cards: [],
    selectedCard: null
  };

  public async componentDidMount() {
    try {
      const response = await axios.get(`/api/cards/list`);
      this.setState({ cards: response.data.cards });
    } catch (e) {
      this.setState({ isError: true });
    }
  }

  public selectCard = (selectedCard: ICardDefinition) => {
    this.setState(() => ({ selectedCard }));
  };

  public render() {
    const { cards, selectedCard } = this.state;

    /* tslint:disable no-console */
    console.log("selectedCard", this.state);
    return (
      <div className="container">
        <h2 className="title">Update cards page:</h2>
        <div className="section-container">
          <div className="cards-list">
            <CardsList
              cards={cards}
              selectCard={this.selectCard}
              selectedCard={selectedCard}
            />
          </div>
          <div className="section" />
          {!!cards.length && (
            <div className="section">
              <CardPreview card={selectedCard} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UpdateCardPage;

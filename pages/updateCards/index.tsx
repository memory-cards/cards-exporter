import axios from "axios";
import React, { Component } from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardPreview from "./components/CardPreview";
import CardsList from "./components/CardsList";

import "./styles.scss";

interface State {
  cards: ICardDefinition[];
}

class UpdateCardPage extends Component<State> {
  public state = {
    cards: []
  };

  public async componentDidMount() {
    try {
      const response = await axios.get(`/api/cards/list`);
      this.setState({ cards: response.data.cards });
    } catch (e) {
      this.setState({ isError: true });
    }
  }

  public render() {
    const { cards } = this.state;

    console.log(this.state);
    return (
      <div className="container">
        <h2 className="title">Update cards page:</h2>
        <div className="section-container">
          <div className="cards-list">
            <CardsList cards={cards} />
          </div>
          <div className="section">Edit</div>
          {cards.length && (
            <div className="section">
              <CardPreview card={cards[400]} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default UpdateCardPage;

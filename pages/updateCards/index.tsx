import axios from "axios";
/* tslint:disable */
import { EditorState } from "draft-js";
import * as React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import Header from "../../components/Header";
import CardPreview from "./components/CardPreview";
import CardsList from "./components/CardsList";

/* tslint:disable */
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.scss";

interface State {
  cards: ICardDefinition[];
  selectedCard: ICardDefinition | null;
  editorState?: any;
}

class UpdateCardPage extends React.Component<State> {
  public state = {
    cards: [],
    selectedCard: null,
    editorState: undefined
  };

  public async componentDidMount() {
    try {
      const { data } = await axios.get(`/api/cards/list`);
      this.setState({
        cards: data.cards,
        editorState: EditorState.createEmpty()
      });
    } catch (e) {
      //
    }
  }

  public selectCard = (selectedCard: ICardDefinition) => {
    this.setState(() => ({ selectedCard }));
  };

  public render() {
    const { cards, selectedCard } = this.state;

    return (
      <div className="update-page">
        <Header />
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

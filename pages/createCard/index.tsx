import axios from "axios";
import { stateToHTML } from "draft-js-export-html";
/* tslint:disable */
// @ts-ignore
import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";
import * as React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardEditor from "../../components/Editor";
import CardPreview from "../../pages/updateCards/components/CardPreview";
import Header from "../../components/Header";

import "./styles.scss";

interface State {
  card: ICardDefinition | null;
  editorState?: EditorState;
}

class CreateCardPage extends React.Component<State> {
  public state = {
    card: null,
    editorState: undefined
  };

  public async componentDidMount() {
    try {
      const { data } = await axios.get(`/api/cards/list`);
      const card = data.cards[130];
      const draft = htmlToDraft(card.card.question);
      if (draft) {
        const contentState = ContentState.createFromBlockArray(
          draft.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          card,
          editorState
        });
      } else {
        this.setState({
          editorState: EditorState.createEmpty()
        });
      }
    } catch (e) {
      //
    }
  }

  public editTemplate = (editorState: EditorState) => {
    this.setState({
      editorState
    });
    if (editorState) {
      console.log(stateToHTML(editorState.getCurrentContent()));
    }
  };

  public render() {
    const { editorState, card } = this.state;

    return (
      <div className="create-card-page">
        <Header />
        <div className="create-card-page-container">
          <h2>Create card page:</h2>
          <div className="section-container">
            <div className="section">
              <CardEditor
                editorState={editorState}
                editTemplate={this.editTemplate}
              />
            </div>
            <div className="editor section">
              <CardPreview card={card} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateCardPage;

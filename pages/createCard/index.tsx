// import axios from "axios";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import * as React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardEditor from "../../components/Editor";
import Header from "../../components/Header";
import CardPreview from "../../pages/updateCards/components/CardPreview";

import "./styles.scss";

type MainCardFieldType = "question" | "comment";

interface State {
  card: ICardDefinition | null;
  questionEditorState?: EditorState;
  commentEditorState?: EditorState;
  isPreviewVisible: boolean;
}

class CreateCardPage extends React.Component<State> {
  public state = {
    card: null,
    commentEditorState: undefined,
    isPreviewVisible: true,
    questionEditorState: undefined
  };

  public async componentDidMount() {
    try {
      // const { data } = await axios.get(`/api/cards/list`);
      // const card = data.cards[1404];

      this.setCardToEditorState({
        card: { question: "5", comment: "sdlfj" },
        lang: "5",
        tags: [],
        type: "info"
      });
    } catch (e) {
      //
    }
  }

  public getEditTemplateHandler = (mainCardField: MainCardFieldType) => {
    const stateCardField = this.getStateMainCardFieldName(mainCardField);

    return (editorState: EditorState) => {
      const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      this.setState(({ card }: State) => ({
        [stateCardField]: editorState,
        card: {
          ...card,
          card: { ...card!.card, [mainCardField]: html }
        },
        isPreviewVisible: false
      }));
    };
  };

  public getStateMainCardFieldName = (mainCardField: MainCardFieldType) =>
    `${mainCardField}EditorState`;

  public showPreview = () => this.setState({ isPreviewVisible: true });

  private setCardToEditorState = (card: ICardDefinition) => {
    this.setCardFieldToEditorState(card.card.question, "question");
    if (card.card.comment) {
      this.setCardFieldToEditorState(card.card.comment, "comment");
    }
    this.setState({ card });
  };

  private setCardFieldToEditorState = (
    fieldContent: string,
    mainCardField: MainCardFieldType
  ) => {
    const draft = htmlToDraft(fieldContent);
    const stateCardField = this.getStateMainCardFieldName(mainCardField);

    if (draft) {
      const contentState = ContentState.createFromBlockArray(
        draft.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ [stateCardField]: editorState });
    } else {
      this.setState({ [stateCardField]: EditorState.createEmpty() });
    }
  };

  public render() {
    const {
      questionEditorState,
      card,
      isPreviewVisible,
      commentEditorState
    } = this.state;

    if (!this.state.card || !questionEditorState || !commentEditorState) {
      return null;
    }

    return (
      <div className="create-card-page">
        <Header />
        <div className="create-card-page-container">
          <h1>Create card page:</h1>
          <div className="section-container">
            <div className="section">
              <h3>Question:</h3>
              <CardEditor
                editorState={questionEditorState}
                editTemplate={this.getEditTemplateHandler("question")}
              />
              <h3>Comment:</h3>
              <CardEditor
                editorState={commentEditorState}
                editTemplate={this.getEditTemplateHandler("comment")}
              />
            </div>
            <div className="editor section">
              {isPreviewVisible ? (
                <CardPreview card={card} />
              ) : (
                <button onClick={this.showPreview}>Show preview</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateCardPage;

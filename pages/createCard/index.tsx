// import axios from "axios";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import * as React from "react";
import { CardType } from "~/typings/common";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardEditor from "../../components/Editor";
import Header from "../../components/Header";
import CardPreview from "../../pages/updateCards/components/CardPreview";
import CardTypeDropdown from "./CardTypeDropdown";

import "./styles.scss";

type MainCardFieldType = "question" | "comment";
const cardTypeDropdownOptions = Object.values(CardType);

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
      const html = this.getHtmlEditorContent(editorState);
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
    this.setCardFieldToEditorState(card.card.question || "", "question");
    this.setCardFieldToEditorState(card.card.comment || "", "comment");
    this.setState({ card });
  };

  private setCardFieldToEditorState = (
    fieldContent: string,
    mainCardField: MainCardFieldType
  ) => {
    const draft = htmlToDraft(fieldContent);
    const stateCardField = this.getStateMainCardFieldName(mainCardField);
    let editorState;

    if (draft) {
      const { contentBlocks } = draft;
      const contentState = ContentState.createFromBlockArray(contentBlocks);
      editorState = EditorState.createWithContent(contentState);
    } else {
      editorState = EditorState.createEmpty();
    }
    this.setState({ [stateCardField]: editorState });
  };

  public changeCardType = (type: string) => {
    this.setState(({ card }: State) => ({
      card: { ...card, type },
      isPreviewVisible: false
    }));
  };

  public getHtmlEditorContent = (editorState: EditorState) =>
    draftToHtml(convertToRaw(editorState.getCurrentContent()));

  public showResult = () => {
    const htmlCard = {
      // @ts-ignore
      ...this.state.card,
      card: {
        comment: this.getHtmlEditorContent(
          this.state[this.getStateMainCardFieldName("comment")]
        ),
        question: this.getHtmlEditorContent(
          this.state[this.getStateMainCardFieldName("question")]
        )
      }
    };
    console.log(JSON.stringify(htmlCard));
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
              <h3>Card type:</h3>
              <CardTypeDropdown
                options={cardTypeDropdownOptions}
                onСhangeCardType={this.changeCardType}
              />
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
              <button onClick={this.showResult}>Show data</button>
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

import axios from "axios";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import * as React from "react";
import { CardType } from "~/typings/common";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardEditor from "~/components/Editor";
import Header from "~/components/Header";
import Select from "~/components/Select";
import Typeahead, { TypeaheadOption } from "~/components/Typeahead";
import CardPreview from "~/pages/updateCards/components/CardPreview";
import CardAnswers from "./CardAnswers";

import "./styles.scss";

const cardTypeOptions = Object.values(CardType);
const cardLanguageOptions = ["en", "ru"];
const EMPTY_CARD = {
  card: {
    answers: [{ text: "", id: "1111" }],
    comment: "",
    question: ""
  },
  lang: cardLanguageOptions[0],
  tags: [],
  type: CardType.CHOOSE_SEQUENCE
};

type MainCardFieldType = "question" | "comment";

interface State {
  repoTags: TypeaheadOption[];
  card: ICardDefinition;
  questionEditorState: EditorState;
  commentEditorState: EditorState;
  isPreviewVisible: boolean;
}

class CreateCardPage extends React.Component<State> {
  public state = {
    card: EMPTY_CARD,
    commentEditorState: EditorState.createEmpty(),
    isPreviewVisible: false,
    questionEditorState: EditorState.createEmpty(),
    repoTags: []
  };

  public async componentDidMount() {
    try {
      const { data } = await axios.get(`/api/cards/tags`);
      const repoTags = Object.keys(data.tags).map(tag => ({
        id: tag,
        label: tag
      }));

      this.setState({ repoTags });
      this.setCardToEditorState(EMPTY_CARD);
    } catch (e) {
      //
    }
  }

  public getEditTemplateHandler = (mainCardField: MainCardFieldType) => {
    const stateCardField = `${mainCardField}EditorState`;

    return (editorState: EditorState) => {
      const html = this.getHtmlEditorContent(editorState);
      this.setState(({ card }: State) => ({
        [stateCardField]: editorState,
        card: {
          ...card,
          card: { ...card.card, [mainCardField]: html }
        },
        isPreviewVisible: false
      }));
    };
  };

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
    const stateCardField = `${mainCardField}EditorState`;
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
      card: { ...card, type }
    }));
  };

  public changeCardLanguage = (lang: string) => {
    this.setState(({ card }: State) => {
      card.lang = lang;
      return { card };
    });
  };

  public getHtmlEditorContent = (editorState: EditorState) =>
    draftToHtml(convertToRaw(editorState.getCurrentContent()));

  public showResult = () => {
    const { commentEditorState, questionEditorState, card } = this.state;
    const answers = card.card.answers.map(answer => {
      const ans: { text: string; correct?: true } = { text: answer.text };
      if (
        this.state.card.type === CardType.CHOOSE_OPTIONS &&
        "correct" in answer
      ) {
        ans.correct = true;
      }
      return ans;
    });
    const htmlCard = {
      ...card,
      card: {
        answers,
        comment: this.getHtmlEditorContent(commentEditorState),
        question: this.getHtmlEditorContent(questionEditorState)
      }
    };
    console.log(JSON.stringify(htmlCard));
  };

  public changeTagSelection = (selected: TypeaheadOption[]) => {
    this.setState(({ card }: State) => {
      const tags = selected.map(({ label }) => label);
      card.tags = tags;
      return { card };
    });
  };

  public updateAnswers = (answers: Array<{ text: string; correct?: true }>) => {
    this.setState(({ card }: State) => {
      return {
        card: {
          ...card,
          card: { ...card.card, answers }
        }
      };
    });
  };

  public render() {
    const {
      questionEditorState,
      card,
      isPreviewVisible,
      commentEditorState,
      repoTags
    } = this.state;

    const selectedTags = card.tags.map(tag => ({ id: tag, label: tag }));

    return (
      <div className="create-card-page">
        <Header />
        <div className="create-card-page-container">
          <h2>Card page:</h2>
          <div className="section-container">
            <div className="section">
              <h4>Language:</h4>
              <Select
                name="card-language"
                value={card.lang}
                options={cardLanguageOptions}
                onSelectOption={this.changeCardLanguage}
              />

              <h4>Tags:</h4>
              <Typeahead
                options={repoTags}
                selectedOptions={selectedTags}
                onChange={this.changeTagSelection}
              />

              <h4>Card type:</h4>
              <Select
                name="card-type"
                value={card.type}
                options={cardTypeOptions}
                onSelectOption={this.changeCardType}
              />

              <h4>Question:</h4>
              <CardEditor
                editorState={questionEditorState}
                editTemplate={this.getEditTemplateHandler("question")}
              />

              <h4>Comment:</h4>
              <CardEditor
                editorState={commentEditorState}
                editTemplate={this.getEditTemplateHandler("comment")}
              />

              {card.type !== CardType.INFO && (
                <>
                  <h4>Answers:</h4>
                  <CardAnswers
                    cardType={card.type}
                    answers={card.card.answers}
                    updateAnswers={this.updateAnswers}
                  />
                </>
              )}
            </div>
            <div className="editor section">
              <button onClick={this.showResult}>Show data</button>
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

import axios from "axios";
// @ts-ignore
import draftToHtml from "draftjs-to-html";
/* tslint:disable */
// @ts-ignore
import htmlToDraft from "html-to-draftjs";
import { convertToRaw, ContentState, EditorState } from "draft-js";
import * as React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardEditor from "../../components/Editor";
import CardPreview from "../../pages/updateCards/components/CardPreview";
import Header from "../../components/Header";

import "./styles.scss";

interface State {
  card: ICardDefinition | null;
  questionEditorState?: EditorState;
  commentEditorState?: EditorState;
  isPreviewVisible: boolean;
}

class CreateCardPage extends React.Component<State> {
  public state = {
    card: null,
    questionEditorState: undefined,
    commentEditorState: undefined,
    isPreviewVisible: true
  };

  public async componentDidMount() {
    try {
      const { data } = await axios.get(`/api/cards/list`);
      const card = data.cards[120];
      const questionDraft = htmlToDraft(card.card.question);
      const commentHTml = `"<p>The HTML input form <code>min</code> and <code>max</code> attributes are used to set the minimum and maximum values that can be set. When the user submits the data, an error box will open helping the user spot their mistake.</p>
      <p>This works for several input types:</p>
      <ul>
      <li>date</li>
      <li>datetime</li>
      <li>datetime-local</li>
      <li>month</li>
      <li>number</li>
      <li>range</li>
      <li>time</li>
      <li>week</li>
      </ul>
      <p>Example:</p>
      <pre><code class="language-html">&#x3C;form
        action="/action.php">
         Enter a date before 2000-01-01:
        &#x3C;input
          type="date" name="bday"
            max="1999-12-31">
      
        Enter a date after 1999-12-31:
        &#x3C;input
          type="date" name="bday"
            min="2000-01-02">
      
        Rate your experience from 1-5:
        &#x3C;input
          type="number" name="rating"
            min="1" max="5">
      
        &#x3C;input type="submit">
      &#x3C;/form>
      </code></pre>
      <p><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="320" height="132"><defs><path id="b" d="M20 38h131v19H20z"/><filter id="a" width="109.2%" height="163.2%" x="-4.6%" y="-31.6%" filterUnits="objectBoundingBox"><feOffset in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"/><feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/><feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0.329411765 0 0 0 0 0.560784314 0 0 0 0 0.8 0 0 0 1 0"/></filter></defs><g fill="none" fill-rule="evenodd"><rect width="320" height="132" fill="#FFF" rx="9"/><use fill="#000" filter="url(#a)" xlink:href="#b"/><path fill="#FFF" stroke="#548FCC" stroke-linejoin="square" d="M20.5 38.5h130v18h-130z"/><text fill="#000" font-family="Courier" font-size="12"><tspan x="24" y="52">12/26/2004</tspan></text><text fill="#000" font-family="ArialMT, Arial" font-size="14"><tspan x="20" y="30">Enter a date before 01-01-2000:</tspan></text><path fill="#000" stroke="#000" d="M137.83685 44.5l2.62516 4.87852L143.08717 44.5h-5.25032z"/><path fill="#FFF" stroke="gray" d="M29.5 58.7282L22.15997 66.5H15c-1.38071 0-2.5 1.11929-2.5 2.5v38c0 1.38071 1.11929 2.5 2.5 2.5h275c1.38071 0 2.5-1.11929 2.5-2.5V69c0-1.38071-1.11929-2.5-2.5-2.5H36.84003L29.5 58.7282z"/><rect width="23" height="23" x="20" y="75" fill="#FFA303" rx="3"/><circle cx="32" cy="92" r="2" fill="#FFF"/><path fill="#FFF" d="M30 80h4v8h-4z"/><text fill="#000" font-family="ArialMT, Arial" font-size="13"><tspan x="52" y="92">Value must be 12/31/1999 or earlier.</tspan></text></g></svg></p>
      <!--[View CodePen](https://codepen.io/enkidevs/pen/qKLKJm)--> 
      <p><strong>Note:</strong> When setting the <code>min</code> value, it cannot be greater than the max value, and vice-versa.</p>
      "`;
      const commentDraft = htmlToDraft(commentHTml);

      if (questionDraft) {
        const contentState = ContentState.createFromBlockArray(
          questionDraft.contentBlocks
        );
        const questionEditorState = EditorState.createWithContent(contentState);
        this.setState({ questionEditorState });
      } else {
        this.setState({ questionEditorState: EditorState.createEmpty() });
      }

      if (commentDraft) {
        const contentState = ContentState.createFromBlockArray(
          commentDraft.contentBlocks
        );
        const commentEditorState = EditorState.createWithContent(contentState);
        this.setState({ commentEditorState });
      } else {
        this.setState({ commentEditorState: EditorState.createEmpty() });
      }
      this.setState({ card });
    } catch (e) {
      //
    }
  }

  public editQuestionTemplate = (questionEditorState: EditorState) => {
    const html = draftToHtml(
      convertToRaw(questionEditorState.getCurrentContent())
    );
    this.setState({
      questionEditorState,
      card: {
        //@ts-ignore
        ...this.state.card,
        card: { ...this.state.card.card, question: html }
      },
      isPreviewVisible: false
    });
    console.log(html);
  };

  public editCommentTemplate = (commentEditorState: EditorState) => {
    const html = draftToHtml(
      convertToRaw(commentEditorState.getCurrentContent())
    );
    this.setState({
      commentEditorState,
      card: {
        //@ts-ignore
        ...this.state.card,
        card: { ...this.state.card.card, comment: html }
      },
      isPreviewVisible: false
    });
    console.log(html);
  };

  showPreview = () => this.setState({ isPreviewVisible: true });

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
    console.log(this.state);
    // @ts-ignore
    // const data = this.state.card!.card.question;

    return (
      <div className="create-card-page">
        <Header />
        <div className="create-card-page-container">
          <h1>Create card page:</h1>
          <div className="section-container">
            <div className="section">
              <h2>Question:</h2>
              <CardEditor
                editorState={questionEditorState}
                editTemplate={this.editQuestionTemplate}
              />
            </div>
            <div className="section">
              <h2>Comment:</h2>
              <CardEditor
                editorState={commentEditorState}
                editTemplate={this.editCommentTemplate}
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

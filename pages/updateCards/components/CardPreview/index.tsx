/* tslint:disable no-var-requires no-submodule-imports */
import * as React from "react";
import Frame from "react-frame-component";
import { ICardDefinition } from "~/typings/ICardDefinition";

import "./styles.scss";

enum CardType {
  INFO = "info",
  CHOOSE_SEQUENCE = "choose_sequence",
  CHOOSE_OPTIONS = "choose_options",
  ORDER_ITEMS = "order_items"
}

const cardProcessor = (card: ICardDefinition | null) => {
  if (card) {
    switch (card.type) {
      case CardType.CHOOSE_SEQUENCE:
        return require(`card-types/types/choose_sequence`)(card);
      case CardType.CHOOSE_OPTIONS:
        return require(`card-types/types/choose_options`)(card);
      case CardType.ORDER_ITEMS:
        return require(`card-types/types/order_items`)(card);
      case CardType.INFO:
        return require(`card-types/types/info`)(card);
    }
  }
};

interface Props {
  card: ICardDefinition | null;
}

interface State {
  isBackVisible: boolean;
  isScriptLoading: boolean;
  processedCard: {
    front: string;
    back: string;
  };
  previousCardBack: string;
}

class CardPreview extends React.Component<Props, State> {
  public state = {
    isBackVisible: false,
    isScriptLoading: true,
    previousCardBack: "",
    processedCard: !!this.props.card && cardProcessor(this.props.card)
  };

  public showFrontTimer: NodeJS.Timeout | null = null;

  public componentDidMount() {
    if (this.props.card) {
      this.executeCardPreview(this.props.card);
    }
  }

  public componentDidUpdate = (props: Props) => {
    if (this.props.card && this.props.card !== props.card) {
      this.executeCardPreview(this.props.card);
    }
  };

  public executeCardPreview = (card: ICardDefinition) => {
    this.setState(() => ({ isScriptLoading: true }));
    this.resetStore();
    this.clearShowFrontTimer();
    this.setState(() => {
      const processedCard = cardProcessor(card);
      this.showFront(processedCard.front);

      return {
        processedCard,
        /* tslint:disable object-literal-sort-keys */
        isBackVisible: false,
        previousCardBack: processedCard.back
      };
    });
  };

  public clearShowFrontTimer = () => {
    if (this.showFrontTimer) {
      clearTimeout(this.showFrontTimer);
      this.showFrontTimer = null;
    }
  };

  /*
   Our card processors save the state of inputs in front card after user
   manipulation and then restore it when show the answer. The solution is
   to run previous back card script, after it we don't save user's answer.
   */
  public resetStore = () => {
    const { previousCardBack } = this.state;

    if (previousCardBack) {
      this.runCardScript(previousCardBack);
    }
  };

  public showFront = (front: string) => {
    // add setTimeout because script does not work properly
    this.showFrontTimer = setTimeout(() => {
      this.runCardScript(front);
      this.setState(() => ({ isScriptLoading: false }));
    }, 20);
  };

  public showBack = () => {
    this.setState(() => ({ isBackVisible: true }));
    this.runCardScript(this.state.processedCard.back);
  };

  public runCardScript = (htmlWithScript: string) => {
    const scriptRegexp = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
    const scriptMatch = scriptRegexp.exec(htmlWithScript);

    if (scriptMatch && scriptMatch[1]) {
      const frame = window.document.querySelector(
        "#frame"
      ) as HTMLIFrameElement;
      const body = frame.contentWindow!.document.querySelector("body");
      const scriptElement = window.document.createElement("script");
      const script = scriptMatch[1].trim();
      // console.log(scriptElement);
      scriptElement.type = "text/javascript";
      scriptElement.text = script;

      body!.appendChild(scriptElement);
      body!.removeChild(scriptElement);
    }
  };

  public render() {
    const { processedCard, isBackVisible, isScriptLoading } = this.state;

    if (!this.props.card) {
      return null;
    }

    return (
      <Frame id="frame" className={isScriptLoading ? "invisible" : ""}>
        <div dangerouslySetInnerHTML={{ __html: processedCard.front }} />
        {isBackVisible ? (
          <div dangerouslySetInnerHTML={{ __html: processedCard.back }} />
        ) : (
          <button onClick={this.showBack}>Show back</button>
        )}
      </Frame>
    );
  }
}

export default CardPreview;

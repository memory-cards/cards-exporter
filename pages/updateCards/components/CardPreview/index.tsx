/* tslint:disable no-var-requires no-submodule-imports */
import * as React from "react";
import Frame from "react-frame-component";
import { ICardDefinition } from "~/typings/ICardDefinition";

import "./styles.scss";

const cardProcessor = (card: ICardDefinition | null) => {
  if (card) {
    switch (card.type) {
      case "choose_sequence":
        return require(`card-types/types/choose_sequence`)(card);
      case "choose_options":
        return require(`card-types/types/choose_options`)(card);
      case "order_items":
        return require(`card-types/types/order_items`)(card);
      case "info":
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

  public componentDidUpdate = (props: Props) => {
    if (this.props.card !== props.card) {
      this.setState(() => ({ isScriptLoading: true }));
      this.resetStore();
      this.clearShowFrontTimer();
      this.setState(() => {
        const processedCard = cardProcessor(this.props.card);
        this.showFront(processedCard.front);

        return {
          processedCard,
          /* tslint:disable object-literal-sort-keys */
          isBackVisible: false,
          previousCardBack: processedCard.back
        };
      });
    }
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

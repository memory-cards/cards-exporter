/* tslint:disable no-var-requires no-submodule-imports */
import React, { Component } from "react";
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
}

class CardPreview extends Component<Props, State> {
  public state = {
    isBackVisible: false,
    isScriptLoading: true,
    processedCard: !!this.props.card && cardProcessor(this.props.card)
  };

  public showFrontTimer: NodeJS.Timeout | null = null;

  public componentDidUpdate = (props: Props) => {
    if (this.props.card !== props.card) {
      this.setState(() => ({ isScriptLoading: true }));
      this.clearShowFrontTimer();
      this.setState(() => {
        const processedCard = cardProcessor(this.props.card);
        this.showFront(processedCard.front);
        return { processedCard, isBackVisible: false };
      });
    }
  };

  public clearShowFrontTimer = () => {
    if (this.showFrontTimer) {
      clearTimeout(this.showFrontTimer);
      this.showFrontTimer = null;
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
      const frame = document.querySelector("#frame") as HTMLIFrameElement;
      const body = frame.contentWindow!.document.querySelector("body");
      const scriptElement = document.createElement("script");
      const script = scriptMatch[1].trim();
      // console.log(scriptElement);
      scriptElement.type = "text/javascript";
      scriptElement.text = script;

      body!.appendChild(scriptElement);
    }
  };

  public render() {
    const { processedCard, isBackVisible, isScriptLoading } = this.state;

    if (!this.props.card) {
      return null;
    }

    return (
      <div>
        <Frame id="frame" className={isScriptLoading ? "invisible" : ""}>
          <div dangerouslySetInnerHTML={{ __html: processedCard.front }} />
          {isBackVisible ? (
            <div dangerouslySetInnerHTML={{ __html: processedCard.back }} />
          ) : (
            <button onClick={this.showBack}>Show back</button>
          )}
        </Frame>
      </div>
    );
  }
}

export default CardPreview;

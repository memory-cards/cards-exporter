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

const INTERVAL = 100;

interface Props {
  card: ICardDefinition | null;
}

interface State {
  isBackVisible: boolean;
  processedCard: {
    front: string;
    back: string;
  };
}

class CardPreview extends Component<Props, State> {
  public state = {
    isBackVisible: false,
    processedCard: !!this.props.card && cardProcessor(this.props.card)
  };

  public timer: NodeJS.Timeout | null = null;

  public componentDidUpdate = (props: Props) => {
    if (this.props.card !== props.card) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.setState(() => {
        const processedCard = cardProcessor(this.props.card);
        // add setTimeout because script does not work properly
        this.timer = setTimeout(
          () => this.runCardScript(processedCard.front),
          INTERVAL
        );
        return { processedCard, isBackVisible: false };
      });
    }
  };

  public showBack = () => {
    this.setState(() => ({ isBackVisible: true }));
    this.runCardScript(this.state.processedCard.back);
  };

  public runCardScript = (htmlWithScript: string) => {
    const scriptRegexp = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
    const scriptMatch = scriptRegexp.exec(htmlWithScript);

    if (scriptMatch) {
      const frame = document.querySelector("#frame") as HTMLIFrameElement;
      const body = frame.contentWindow!.document.querySelector("body");
      const scriptElement = document.createElement("script");
      const script = scriptMatch[1].trim();
      // console.log(scriptElement);
      // console.dir(frame.contentWindow);
      scriptElement.type = "text/javascript";
      scriptElement.text = script;

      body!.appendChild(scriptElement);
    }
  };

  public render() {
    const { processedCard, isBackVisible } = this.state;

    if (!this.props.card) {
      return null;
    }

    return (
      <div>
        <Frame id="frame">
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

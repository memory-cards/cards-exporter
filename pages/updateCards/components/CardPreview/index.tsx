/* tslint:disable no-var-requires no-submodule-imports */
import React, { Component } from "react";
import Frame from "react-frame-component";
import { ICardDefinition } from "~/typings/ICardDefinition";

interface Props {
  card: ICardDefinition | null;
}

interface State {
  isBackVisible: boolean;
  processedCard: any;
}

const INTERVAL = 200;

const processor = (card: ICardDefinition | null) => {
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

class CardPreview extends Component<Props, State> {
  public state = {
    isBackVisible: false,
    processedCard: !!this.props.card && processor(this.props.card)
  };

  public timer: NodeJS.Timeout | null = null;

  public componentDidUpdate = (props: Props) => {
    console.log("componentDidUpdate this.props", this.props);
    console.log("componentDidUpdate props", props);
    if (this.props.card !== props.card) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.setState(() => {
        const processedCard = processor(this.props.card);
        this.timer = setTimeout(() => {
          this.runScript(processedCard.front);
        }, INTERVAL);
        return { processedCard, isBackVisible: false };
      });
    }
  };

  public showBack = () => {
    this.setState(() => ({ isBackVisible: true }));
    this.runScript(this.state.processedCard.back);
  };

  public runScript = (htmlWithScript: string) => {
    const scriptRegexp = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
    const scriptMatch = scriptRegexp.exec(htmlWithScript);

    if (scriptMatch) {
      const frame = document.querySelector("#frame") as HTMLIFrameElement;
      const body = frame.contentWindow!.document.querySelector("body");
      const scriptElement = document.createElement("script");
      const script = scriptMatch[1].trim();
      console.log(scriptElement);
      console.dir(frame.contentWindow);
      scriptElement.type = "text/javascript";
      scriptElement.text = script;
      console.log(body);

      body!.appendChild(scriptElement);
    }
  };

  public render() {
    const { processedCard, isBackVisible } = this.state;
    console.log("previewProps", this.props);

    if (!this.props.card) {
      return null;
    }

    return (
      <div>
        <Frame
          id="frame"
          style={{ width: "500px", height: "calc(100vh - 50px)" }}
        >
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

/* tslint:disable no-var-requires no-submodule-imports */
import Frame from "react-frame-component";
const processor = require("card-types/types/choose_sequence");
import React, { Component } from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

interface Props {
  card: ICardDefinition | null;
}

interface State {
  isBackVisible: boolean;
  processedCard: any;
}

class CardPreview extends Component<Props, State> {
  public state = {
    isBackVisible: false,
    processedCard: !!this.props.card && processor(this.props.card)
  };

  public componentDidUpdate = (props: Props) => {
    console.log("componentDidUpdate this.props", this.props);
    console.log("componentDidUpdate props", props);
    if (this.props.card !== props.card) {
      this.setState(() => {
        const processedCard = processor(this.props.card);
        setTimeout(() => {
          this.runScript(processedCard.front);
        }, 500);
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

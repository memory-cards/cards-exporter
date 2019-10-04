/* tslint:disable no-var-requires no-submodule-imports */
import Frame from "react-frame-component";
const processor = require("card-types/types/choose_sequence");
import React, { Component } from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

interface Props {
  card: ICardDefinition;
}

class CardPreview extends Component<Props> {
  public state = {
    processedCard: processor(this.props.card)
  };

  public componentDidMount() {
    setTimeout(() => {
      const { processedCard } = this.state;

      console.log(processedCard.front);
      const script = /<script\b[^>]*>([\s\S]*?)<\/script>/gim.exec(
        processedCard.front
      );

      if (script) {
        const frame = document.querySelector("#frame") as HTMLIFrameElement;
        const scriptElement = document.createElement("script");
        console.log(scriptElement);
        scriptElement.type = "text/javascript";
        scriptElement.text = script[1].trim();

        console.dir(frame.contentWindow);
        const body = frame.contentWindow!.document.querySelector("body");
        console.log(body);
        body!.appendChild(scriptElement);
      }
    }, 1000);
  }

  public render() {
    const { processedCard } = this.state;

    const htmlString = ` <div><div>Front:</div>${
      processedCard.front
    }</div><div>Back:</div>${processedCard.back}
    `;

    return (
      <div>
        <Frame
          id="frame"
          style={{ width: "500px", height: "calc(100vh - 50px)" }}
        >
          <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </Frame>
        {/* <div
            className="question"
            dangerouslySetInnerHTML={{ __html: (() => card.card.question)() }}
          /> */}
      </div>
    );
  }
}

export default CardPreview;

/**
 * @jest-environment jsdom
 */
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import Frame from "react-frame-component";

jest.mock("card-types/types/choose_sequence", () => () => ({
  back: "chooseSequenceBack",
  front: "chooseSequenceFront"
}));

jest.mock("card-types/types/choose_options", () => () => ({
  back: "chooseOptionsBack",
  front: "chooseOptionsFront"
}));

jest.mock("card-types/types/order_items", () => () => ({
  back: "orderItemsBack",
  front: "orderItemsFront"
}));

jest.mock("card-types/types/info", () => () => ({
  back: "infoBack",
  front: "infoFront"
}));

import "../CardsList/components/Card/windowMock";

import CardPreview from "./index";

const card = {
  card: {
    comment: "comment",
    question: "question"
  },
  lang: "en",
  tags: ["js", "ts"],
  type: "choose_sequence"
};

describe("With Enzyme", () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(<CardPreview card={card} />);
  });

  describe("Card", () => {
    it("renders nothing if no selected card", () => {
      component = shallow(<CardPreview card={null} />);

      expect(component.getElement()).toBe(null);
    });

    it("renders Frame", () => {
      expect(component.find(Frame).exists()).toBe(true);
    });

    const testFrontRender = (type: string, expectedFront: string) => {
      it(`renders front for ${type} card`, () => {
        component = shallow(<CardPreview card={{ ...card, type }} />);
        const front = component.find("div").at(0);
        expect(front.exists()).toBe(true);
        expect(front.prop("dangerouslySetInnerHTML")!.__html).toBe(
          expectedFront
        );
      });
    };

    testFrontRender("choose_sequence", "chooseSequenceFront");
    testFrontRender("choose_options", "chooseOptionsFront");
    testFrontRender("order_items", "orderItemsFront");
    testFrontRender("info", "infoFront");

    it("does not render back of the card initially", () => {
      const back = component.find("div").at(1);
      expect(back.exists()).toBe(false);
    });

    describe("runCardScript", () => {
      let mockedAppendChild: jest.SpyInstance<any>;
      let mockedRemoveChild: jest.SpyInstance<any>;

      beforeEach(() => {
        mockedAppendChild = jest.fn();
        mockedRemoveChild = jest.fn();

        window.document.querySelector = jest.fn(() => ({
          appendChild: mockedAppendChild,
          contentWindow: { document: window.document },
          removeChild: mockedRemoveChild
        }));
      });

      it("adds and removes script tag to the page if html has 'script' tags", () => {
        const scriptText = "scriptText";
        (component.instance() as CardPreview).runCardScript(
          `<script>  ${scriptText}  </script>`
        );

        const scriptElement = {
          text: scriptText,
          type: "text/javascript"
        };
        expect(mockedAppendChild).toHaveBeenCalledWith(scriptElement);
        expect(mockedRemoveChild).toHaveBeenCalledWith(scriptElement);
      });

      it("does not add and remove script tag to the page if html has no 'script' tags", () => {
        (component.instance() as CardPreview).runCardScript("scriptText");

        expect(mockedAppendChild).not.toHaveBeenCalled();
        expect(mockedRemoveChild).not.toHaveBeenCalled();
      });
    });

    describe("showBack", () => {
      it("renders back of the card", () => {
        (component.instance() as CardPreview).showBack();
        const back = component.find("div").at(1);

        expect(back.exists()).toBe(true);
        expect(component.state("isBackVisible")).toBe(true);
      });
    });

    describe("showFront", () => {
      it("renders front of the card", () => {
        jest.useFakeTimers();

        (component.instance() as CardPreview).showFront("front12");

        jest.runAllTimers();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 20);
        expect(component.state("isScriptLoading")).toBe(false);
      });
    });

    describe("clearShowFrontTimer", () => {
      it("clears timer if has showFrontTimer", () => {
        const timer = setTimeout(() => ({}), 50);
        const cardPreview = component.instance() as CardPreview;
        cardPreview.showFrontTimer = timer;
        cardPreview.clearShowFrontTimer();

        expect(cardPreview.showFrontTimer).toBe(null);
      });

      it("does nothing if no showFrontTimer", () => {
        const cardPreview = component.instance() as CardPreview;
        cardPreview.showFrontTimer = null;
        cardPreview.clearShowFrontTimer();

        expect(cardPreview.showFrontTimer).toBe(null);
      });
    });

    describe("componentDidUpdate", () => {
      it("calls methods and changes state correctly", () => {
        const newCard = { ...card, type: "info" };
        const cardPreview = component.instance() as CardPreview;
        const spyResetStore = jest.spyOn(cardPreview, "resetStore");
        const spyClearShowFrontTimer = jest.spyOn(
          cardPreview,
          "clearShowFrontTimer"
        );
        component.setProps({ card: newCard });

        expect(cardPreview.state.processedCard).toMatchObject({
          back: "infoBack",
          front: "infoFront"
        });
        expect(cardPreview.state.isBackVisible).toBe(false);
        expect(cardPreview.state.previousCardBack).toBe("infoBack");
        expect(spyResetStore).toHaveBeenCalledTimes(1);
        expect(spyClearShowFrontTimer).toHaveBeenCalledTimes(1);
      });
    });

    describe("resetStore", () => {
      let spy: jest.SpyInstance<any>;
      let cardPreview: CardPreview;

      beforeEach(() => {
        cardPreview = component.instance() as CardPreview;
        spy = jest.spyOn(cardPreview, "runCardScript");
      });

      it("calls runCardScript with correct value", () => {
        const previousCardBack = "previousCardBack";
        component.setState({ previousCardBack });
        cardPreview.resetStore();

        expect(spy).toHaveBeenCalledWith(previousCardBack);
      });
    });
  });
});

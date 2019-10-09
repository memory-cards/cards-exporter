/**
 * @jest-environment jsdom
 */
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import Frame from "react-frame-component";
// import * as TestRenderer from "react-test-renderer";

jest.mock("card-types/types/choose_sequence", () => () => ({
  back: "back",
  front: "front"
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
    it("renders Frame", () => {
      expect(component.find(Frame).exists()).toBe(true);
    });

    it("renders front of the card", () => {
      const front = component.find("div").at(0);
      expect(front.exists()).toBe(true);
      expect(front.prop("dangerouslySetInnerHTML")!.__html).toBe("front");
    });

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
      it("clears timer", () => {
        const timer = setTimeout(() => ({}), 50);
        (component.instance() as CardPreview).showFrontTimer = timer;
        (component.instance() as CardPreview).clearShowFrontTimer();

        expect((component.instance() as CardPreview).showFrontTimer).toBe(null);
      });
    });
  });
});

// describe("With Snapshot Testing", () => {
//   it('IndexPage shows "Cards Exporter"', () => {
//     const component = TestRenderer.create(
//       <Card card={card} selectCard={jest.fn()} isSelected={false} />
//     );
//     const tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });

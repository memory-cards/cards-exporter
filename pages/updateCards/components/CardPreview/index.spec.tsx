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

    it("renders back of the card if push showBack", () => {
      // @ts-ignore
      component.instance().showBack();
      const back = component.find("div").at(1);
      expect(back.exists()).toBe(true);
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

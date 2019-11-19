/**
 * @jest-environment jsdom
 */
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as TestRenderer from "react-test-renderer";
import { ICardDefinition } from "~/typings/ICardDefinition";

import "../Card/windowMock";

import Card from "./index";

const cardQuestion = Array(20)
  .fill("1")
  .join(" ");

const card = {
  card: {
    comment: "comment",
    question: cardQuestion
  },
  lang: "en",
  tags: ["js", "ts"],
  type: "type1"
};

describe("With Enzyme", () => {
  let component: ShallowWrapper;
  let selectCard: (selectedCard: ICardDefinition) => void;

  beforeEach(() => {
    selectCard = jest.fn();
    component = shallow(
      <Card card={card} selectCard={selectCard} isSelected={true} />
    );
  });

  describe("Card", () => {
    it("has correct classname for selected card", () => {
      expect(component.find(".selected").exists()).toBe(true);
    });

    it("has correct classname for not selected card", () => {
      component.setProps({ isSelected: false });

      expect(component.find(".selected").exists()).toBe(false);
    });

    it("renders tags labels", () => {
      const tags = component.find("span.badge");
      expect(tags).toHaveLength(card.tags.length);
      tags.forEach((tag, index) => expect(tag.text()).toBe(card.tags[index]));
    });

    it("renders only first 10 words of the question as card label", () => {
      const shortQuestion = component
        .find("div")
        .at(0)
        .text();
      const expectedText = `${Array(10)
        .fill("1")
        .join(" ")}...`;

      expect(shortQuestion).toBe(expectedText);
    });

    it("renders only shortened words in card label", () => {
      const newCardQuestion = Array(20)
        .fill("5".repeat(40))
        .join(" ");

      const newCard = {
        ...card,
        card: { ...card.card, question: newCardQuestion }
      };

      component = shallow(
        <Card card={newCard} selectCard={selectCard} isSelected={false} />
      );

      const cardQuestionLabel = component
        .find("div")
        .at(0)
        .text();

      const expectedText = `${Array(10)
        .fill("5".repeat(30))
        .join(" ")}...`;

      expect(cardQuestionLabel).toBe(expectedText);
    });

    it("renders short card question without dots if it's not big", () => {
      const newCardQuestion = Array(5)
        .fill("5")
        .join(" ");

      const newCard = {
        ...card,
        card: { ...card.card, question: newCardQuestion }
      };

      component = shallow(
        <Card card={newCard} selectCard={selectCard} isSelected={false} />
      );

      const cardQuestionLabel = component
        .find("div")
        .at(0)
        .text();

      expect(cardQuestionLabel).toBe(newCardQuestion);
    });

    it("click on card calls selectCard method", () => {
      component.find("li").simulate("click");

      expect(selectCard).toHaveBeenCalled();
      expect(selectCard).toHaveBeenCalledWith(card);
    });
  });
});

describe("With Snapshot Testing", () => {
  it('IndexPage shows "Cards Exporter"', () => {
    const component = TestRenderer.create(
      <Card card={card} selectCard={jest.fn()} isSelected={false} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

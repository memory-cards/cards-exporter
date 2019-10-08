import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
// import * as TestRenderer from "react-test-renderer";

import Card from "./components/Card";
import CardsList from "./index";

const getValue = () => Math.random().toString();
const newCard = () => ({
  card: {
    comment: getValue(),
    question: getValue()
  },
  lang: getValue(),
  tags: [getValue()],
  type: getValue()
});

const cards = [newCard(), newCard()];

describe("With Enzyme", () => {
  let cardsList: ShallowWrapper;

  beforeEach(() => {
    cardsList = shallow(
      <CardsList cards={cards} selectCard={jest.fn()} selectedCard={cards[0]} />
    );
  });

  describe("CardsList", () => {
    it("renders correct cards amount", () => {
      expect(cardsList.find(Card).length).toBe(cards.length);
    });

    it("marks selected card correctly", () => {
      const renderedCards = cardsList.find(Card);
      expect(renderedCards.at(0).prop("isSelected")).toBe(true);
      expect(renderedCards.at(1).prop("isSelected")).toBe(false);
    });
  });
});

// describe("With Snapshot Testing", () => {
//   it('IndexPage shows "Cards Exporter"', () => {
//     const component = TestRenderer.create(
//       <CardsList cards={cards} selectCard={jest.fn()} selectedCard={cards[0]} />
//     );
//     const tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });

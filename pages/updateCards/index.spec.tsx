import axios from "axios";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { ICardDefinition } from "~/typings/ICardDefinition";

import CardPreview from "./components/CardPreview";
import CardsList from "./components/CardsList";
import UpdateCardsPage from "./index";

const mockCards = [
  {
    card: {
      comment: "string",
      question: "string"
    },
    lang: "string",
    tags: ["string"],
    type: "string"
  },
  {
    card: {
      comment: "string1",
      question: "string1"
    },
    lang: "string1",
    tags: ["string1"],
    type: "string1"
  },
  {
    card: {
      comment: "string2",
      question: "string2"
    },
    lang: "string2",
    tags: ["string2"],
    type: "string2"
  }
];

describe("filterCards page", () => {
  let page: ShallowWrapper;
  let getSpy: jest.SpyInstance<any>;
  let fetchedCards: ICardDefinition[];
  const props = { cards: [] as any[], selectedCard: null };

  beforeEach(() => {
    fetchedCards = mockCards;
    getSpy = jest.spyOn(axios, "get");
    const res = { data: { cards: fetchedCards } };
    getSpy.mockReturnValue(Promise.resolve(res));
    page = shallow(<UpdateCardsPage {...props} />);
  });

  it("shows correct header", () => {
    expect(page.find("h2").text()).toEqual("Update cards page:");
  });

  it("renders CardsList with initial data", () => {
    const cardsList = page.find(CardsList);

    expect(cardsList.exists()).toBe(true);
    expect(cardsList.prop("cards")).toBe(fetchedCards);
    expect(cardsList.prop("selectedCard")).toBe(null);
  });

  it("updates props when select card", () => {
    const selectedCard = fetchedCards[1];
    page.setState({ selectedCard });

    expect(page.find(CardsList).prop("selectedCard")).toBe(selectedCard);
    expect(page.find(CardPreview).prop("card")).toBe(selectedCard);
  });
});

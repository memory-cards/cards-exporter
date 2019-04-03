import axios from "axios";
import { CommonWrapper, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import FilterCardsPage from "./index";

describe("filterCards page", () => {
  let page: ShallowWrapper;
  let getSpy: jest.SpyInstance<any>;
  let mockTags: { [tagName: string]: number };
  const props = { selectedTags: {}, tags: {} };

  beforeEach(() => {
    mockTags = {
      tag1: Math.random(),
      tag2: Math.random()
    };
    getSpy = jest.spyOn(axios, "get");
    const res = { data: { tags: mockTags } };
    getSpy.mockReturnValue(Promise.resolve(res));
    page = shallow(<FilterCardsPage {...props} />);
  });

  it("shows correct header", () => {
    expect(page.find("h2").text()).toEqual("Select required tags:");
  });

  it("does not show tags if no tags data", () => {
    page.setState({ tags: {} });
    expect(page.find("li").exists()).toBe(false);
  });

  it("shows all tags as listItems dif has tags data", () => {
    expect(page.find("li")).toHaveLength(Object.keys(mockTags).length);
  });

  describe("method updateSelectedTags", () => {
    let li: CommonWrapper;
    const event = { target: { tagName: "INPUT", value: "tag2" } };

    beforeEach(() => {
      li = page.find("li").at(1);
      li.simulate("click", event);
    });

    it("adds tag to selectedTags when click on listItem", () => {
      expect(page.state("selectedTags")).toMatchObject({ tag2: true });
    });

    it("does not set tag to selectedTags when clicked on listItem twice", () => {
      li.simulate("click", event);
      expect(page.state("selectedTags")).toMatchObject({});
    });
  });

  describe("method clearSelectedTags", () => {
    it("clears selectedTags", () => {
      page.setState({ selectedTags: { tag1: true } });
      (page.instance() as FilterCardsPage).clearSelectedTags();
      expect(page.state("selectedTags")).toMatchObject({});
    });
  });

  describe("method getDeck", () => {
    const globalAny: any = global;
    const previousWindow = globalAny.window;

    beforeEach(() => {
      globalAny.window = { open: jest.fn() };
    });

    afterEach(() => {
      globalAny.window = previousWindow;
    });

    it("opens window with correct url if some tags have been selected", () => {
      const tagName1 = "tag1";
      const tagName2 = "tag2";
      page.setState({ selectedTags: { [tagName1]: true, [tagName2]: true } });
      (page.instance() as FilterCardsPage).getDeck();
      expect(globalAny.window.open).toHaveBeenCalledWith(
        `/api/cards/deck?tags=${tagName1}&tags=${tagName2}`
      );
    });

    it("opens window with correct url if no tags have been selected", () => {
      (page.instance() as FilterCardsPage).getDeck();
      expect(globalAny.window.open).toHaveBeenCalledWith(`/api/cards/deck?`);
    });
  });

  it("sets tags to state that were recieved from backend", () => {
    expect(page.state("tags")).toBe(mockTags);
  });

  it("shows errorMessage if data from backend has not been recieved", () => {
    getSpy.mockImplementation(() => {
      throw new Error("error");
    });
    page = shallow(<FilterCardsPage {...props} />);
    const expectedText = "Sorry, backend data has not been recieved yet :(";

    expect(page.find("div").text()).toBe(expectedText);
  });
});

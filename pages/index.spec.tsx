import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as TestRenderer from "react-test-renderer";

import Index from "./index";

describe("With Enzyme", () => {
  let page: ShallowWrapper;

  beforeEach(() => {
    page = shallow(<Index />);
  });

  describe("Main page", () => {
    it('has title "Cards Exporter"', () => {
      expect(page.find("h1").text()).toEqual("Cards Exporter");
    });

    describe("has menu with link to", () => {
      it("date info", () => {
        expect(page.find('a[href="/api/date"]').exists()).toBe(true);
      });

      it("cards list info", () => {
        expect(page.find('a[href="/api/cards/list"]').exists()).toBe(true);
      });

      it("deck info", () => {
        expect(page.find('a[href="/api/cards/deck"]').exists()).toBe(true);
      });

      it("update card info", () => {
        expect(page.find('a[href="/api/cards/update"]').exists()).toBe(true);
      });

      it("tags info", () => {
        expect(page.find('a[href="/api/cards/tags"]').exists()).toBe(true);
      });

      it("filter cards page", () => {
        expect(page.find('a[href="/filterCards"]').exists()).toBe(true);
      });

      it("update cards page", () => {
        expect(page.find('a[href="/updateCards"]').exists()).toBe(true);
      });
    });
  });
});

describe("With Snapshot Testing", () => {
  it('IndexPage shows "Cards Exporter"', () => {
    const component = TestRenderer.create(<Index />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

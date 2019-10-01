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
      it("date page", () => {
        expect(page.find('a[href="/api/date"]').exists()).toBe(true);
      });

      it("cards list page", () => {
        expect(page.find('a[href="/api/cards/list"]').exists()).toBe(true);
      });

      it("deck page", () => {
        expect(page.find('a[href="/api/cards/deck"]').exists()).toBe(true);
      });

      it("update card page", () => {
        expect(page.find('a[href="/api/cards/update"]').exists()).toBe(true);
      });

      it("tags page", () => {
        expect(page.find('a[href="/api/cards/tags"]').exists()).toBe(true);
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

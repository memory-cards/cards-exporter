import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as TestRenderer from "react-test-renderer";

import Header from "../components/Header";
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

    it("renders Header", () => {
      expect(page.find(Header).exists()).toBe(true);
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

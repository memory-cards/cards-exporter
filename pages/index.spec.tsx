import { shallow } from "enzyme";
import * as React from "react";
import * as TestRenderer from "react-test-renderer";

import Index from "./index";

describe("With Enzyme", () => {
  it('IndexPage shows "Cards Exporter"', () => {
    const page = shallow(<Index />);
    expect(page.find("h1").text()).toEqual("Cards Exporter");
  });
});

describe("With Snapshot Testing", () => {
  it('IndexPage shows "Cards Exporter"', () => {
    const component = TestRenderer.create(<Index />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

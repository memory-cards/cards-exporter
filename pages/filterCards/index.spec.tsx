import { shallow } from "enzyme";
import * as React from "react";

import Index from "./index";

describe("filterCards page", () => {
  const props = { selectedTags: {}, tags: {} };
  const page = shallow(<Index {...props} />);

  it("shows correct header", () => {
    expect(page.find("h2").text()).toEqual("Select required tags:");
  });

  it("does not show tags if no tags data", () => {
    expect(page.find("li").exists()).toBe(false);
  });

  it("shows all tags as listItems if has tags data", () => {
    const mockTags = {
      tag1: Math.random(),
      tag2: Math.random()
    };

    page.setState({ tags: mockTags });
    expect(page.find("li")).toHaveLength(Object.keys(mockTags).length);
  });
});

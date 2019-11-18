import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { Typeahead as ReactTypeahead } from "react-bootstrap-typeahead";

import Typeahead from "./index";

const MOCKED_OPTIONS = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" }
];

describe("with Enzyme", () => {
  let component: ShallowWrapper;

  it("renders ReactTypeahead", () => {
    component = shallow(
      <Typeahead options={MOCKED_OPTIONS} onChange={jest.fn()} />
    );

    expect(component.exists()).toBe(true);
    expect(component.find(ReactTypeahead).exists()).toBe(true);
    expect(component.prop("multiple")).toBe(true);
    expect(component.prop("options")).toBe(MOCKED_OPTIONS);
  });
});

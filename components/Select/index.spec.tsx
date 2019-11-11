import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import Select from "./index";

const MOCKED_OPTIONS = ["1", "2", "3", "4"];

describe("with Enzyme", () => {
  let component: ShallowWrapper;
  const onSelectOption = jest.fn();

  it("renders select tag with options", () => {
    component = shallow(
      <Select
        name="name"
        options={MOCKED_OPTIONS}
        onSelectOption={onSelectOption}
      />
    );
    expect(component.exists()).toBe(true);
    expect(component.find("option").length).toBe(MOCKED_OPTIONS.length);
  });

  it("renders select tag with preselected value", () => {
    component = shallow(
      <Select
        name="name"
        value="4"
        options={MOCKED_OPTIONS}
        onSelectOption={onSelectOption}
      />
    );

    expect(
      component
        .find("option")
        .filterWhere(option => option.prop("selected") === true)
        .text()
    ).toBe("4");
  });

  it("calls onSelectOption callback with correct value", () => {
    component = shallow(
      <Select
        name="name"
        value="4"
        options={MOCKED_OPTIONS}
        onSelectOption={onSelectOption}
      />
    );

    const select = component.find("select");
    const onChangeArguments = ({
      target: { value: "value" }
    } as any) as React.ChangeEvent<HTMLSelectElement>;
    select.prop("onChange")!(onChangeArguments);

    expect(onSelectOption).toHaveBeenCalledWith("value");
  });
});

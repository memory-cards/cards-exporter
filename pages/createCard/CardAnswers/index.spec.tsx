import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { CardType } from "~/typings/common";

import CardAnswers from "./index";

describe("With Enzyme", () => {
  let component: ShallowWrapper;
  let updateAnswers: any;
  const answers = [
    {
      id: "id1",
      text: "text1"
    },
    {
      id: "id2",
      text: "text2"
    },
    {
      id: "id3",
      text: "text3"
    }
  ];

  beforeEach(() => {
    global.Math.random = () => 0.5;
    updateAnswers = jest.fn();
    component = shallow(
      <CardAnswers
        answers={answers}
        cardType={CardType.CHOOSE_OPTIONS}
        updateAnswers={updateAnswers}
      />
    );
  });

  describe("CardAnswers", () => {
    it('does not render radio section for not "choose_options" card type', () => {
      component.setProps({ cardType: CardType.CHOOSE_SEQUENCE });
      expect(component.find(".input-group-prepend").exists()).toBe(false);
    });

    it('renders radio section for "choose_options" card type', () => {
      expect(component.find(".input-group-prepend").exists()).toBe(true);
    });

    it("renders correct amount of answers", () => {
      expect(component.find(".form-control").length).toBe(answers.length);
    });

    it('has "add answer" button', () => {
      expect(
        component
          .find("button")
          .filterWhere(btn => btn.text() === "Add answer")
          .exists()
      ).toBe(true);
    });

    describe("addAnswer", () => {
      it("adds new item to answers", () => {
        const addButton = component
          .find("button")
          .filterWhere(btn => btn.text() === "Add answer");

        addButton.simulate("click");
        const newAnswers = [...answers, { id: "0.5", text: "" }];

        expect(updateAnswers).toHaveBeenCalledWith(newAnswers);
      });
    });

    describe("removeAnswer", () => {
      it("removes selected answer from the list of answers", () => {
        const buttons = component.find("button");
        const removeButton = buttons.at(2);

        removeButton.simulate("click", { target: { name: "id2" } });
        const newAnswers = [
          { id: "id1", text: "text1" },
          { id: "id3", text: "text3" }
        ];

        expect(updateAnswers).toHaveBeenCalledWith(newAnswers);
      });
    });

    describe("changeAnswer", () => {
      it("changes selected answer in the list of answers", () => {
        const inputs = component.find("input.form-control");
        const input = inputs.at(2);

        input.simulate("change", {
          target: { value: "newValue", name: "id2" }
        });
        const newAnswers = [
          { id: "id1", text: "text1" },
          { id: "id2", text: "newValue" },
          { id: "id3", text: "text3" }
        ];

        expect(updateAnswers).toHaveBeenCalledWith(newAnswers);
      });
    });

    describe("selectCorrectAnswer", () => {
      it("sets correct answer for choose_options card", () => {
        component.setProps({ cardType: CardType.CHOOSE_OPTIONS });
        const checkbox1 = component.find("#id1");
        const checkbox2 = component.find("#id2");

        checkbox1.simulate("change", {
          target: { id: "id1", checked: true }
        });
        checkbox2.simulate("change", {
          target: { id: "id2", checked: true }
        });
        checkbox1.simulate("change", {
          target: { id: "id1" }
        });
        const newAnswers = [
          { id: "id1", text: "text1" },
          { id: "id2", text: "text2", correct: true },
          { id: "id3", text: "text3" }
        ];

        expect(updateAnswers).toHaveBeenCalledWith(newAnswers);
      });
    });
  });
});

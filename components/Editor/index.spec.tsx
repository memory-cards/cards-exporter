import { EditorState } from "draft-js";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";

import CardEditor from "./index";

describe("With Enzyme", () => {
  let component: ShallowWrapper;
  let editTemplate: (editorState: EditorState) => void;
  const setState = jest.fn();
  const useStateSpy: jest.SpyInstance<any> = jest.spyOn(React, "useState");
  useStateSpy.mockImplementation(init => [init, setState]);

  beforeEach(() => {
    editTemplate = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("CardsList", () => {
    it("renders nothing if editor state is empty", () => {
      component = shallow(<CardEditor editTemplate={editTemplate} />);
      expect(component.isEmptyRender()).toBe(true);
    });

    it("renders Editor if has editorState", () => {
      component = shallow(
        <CardEditor
          editTemplate={editTemplate}
          editorState={EditorState.createEmpty()}
        />
      );
      expect(component.find(Editor).exists()).toBe(true);
    });

    it("hides toolbar", () => {
      component = shallow(
        <CardEditor
          editTemplate={editTemplate}
          editorState={EditorState.createEmpty()}
        />
      );
      const onBlur: () => void = component.prop("onBlur");

      onBlur();
      expect(setState).toHaveBeenCalledWith(false);
    });

    it("shows toolbar", () => {
      component = shallow(
        <CardEditor
          editTemplate={editTemplate}
          editorState={EditorState.createEmpty()}
        />
      );
      const onFocus: () => void = component.prop("onFocus");

      onFocus();
      expect(setState).toHaveBeenCalledWith(true);
    });
  });
});

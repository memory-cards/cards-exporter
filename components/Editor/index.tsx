import { EditorState } from "draft-js";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";

import toolbarOptions from "./options";

// tslint:disable-next-line: no-submodule-imports
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface Props {
  editTemplate: (editorState: EditorState) => void;
  editorState?: EditorState;
}

const CardEditor = (props: Props) => {
  const [isToolbarVisible, setToolbarVisibility] = React.useState(false);

  const showToolbar = () => setToolbarVisibility(true);
  const hideToolbar = () => setToolbarVisibility(false);

  const { editorState, editTemplate } = props;

  if (!editorState) return null;

  return (
    <Editor
      onFocus={showToolbar}
      onBlur={hideToolbar}
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="form-control"
      onEditorStateChange={editTemplate}
      toolbar={toolbarOptions}
      toolbarHidden={!isToolbarVisible}
    />
  );
};

export default CardEditor;

import { convertToRaw, EditorState } from "draft-js";
// @ts-ignore
import draftToHtml from "draftjs-to-html";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";

import { options } from "./options";

/* tslint:disable */
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "./styles.scss";

interface Props {
  editTemplate: (editorState: EditorState) => void;
  editorState?: EditorState;
}

class CardEditor extends React.Component<Props> {
  render() {
    const { editorState, editTemplate } = this.props;
    if (!editorState) {
      return null;
    }

    return (
      <>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={editTemplate}
          toolbar={options}
        />
        <textarea
          style={{ width: "100%", height: "200px" }}
          disabled
          value={draftToHtml(convertToRaw(editorState!.getCurrentContent()))}
        />
      </>
    );
  }
}

export default CardEditor;

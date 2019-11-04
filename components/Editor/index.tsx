import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import * as React from "react";
import { Editor } from "react-draft-wysiwyg";

import { options } from "./options";

// tslint:disable-next-line: no-submodule-imports
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "./styles.scss";

interface Props {
  editTemplate: (editorState: EditorState) => void;
  editorState?: EditorState;
}

interface State {
  isToolbarVisible: boolean;
}

class CardEditor extends React.Component<Props, State> {
  public state = { isToolbarVisible: false };

  public enterEditor = () => this.setState({ isToolbarVisible: true });
  public leaveEditor = () => this.setState({ isToolbarVisible: false });

  public render() {
    const { editorState, editTemplate } = this.props;
    const { isToolbarVisible } = this.state;

    if (!editorState) {
      return null;
    }

    return (
      <>
        <Editor
          onFocus={this.enterEditor}
          onBlur={this.leaveEditor}
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={editTemplate}
          toolbar={options}
          toolbarHidden={!isToolbarVisible}
        />
        <textarea
          style={{ width: "100%", height: "100px" }}
          disabled
          value={draftToHtml(convertToRaw(editorState!.getCurrentContent()))}
        />
      </>
    );
  }
}

export default CardEditor;

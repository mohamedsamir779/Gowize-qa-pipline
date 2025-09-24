// a rich text editor component 
// props.inputText value of the rich editor if it should be an empty string don't send it
// props.role + props.selectedLanguage are values I needed to update editor state with every change to them
// role.richTextEditorValueHandler is a function that returns ready to store in DB text editor value
// role.placeholder is just a placeholder I made it a prop so this component would be as versatile as it should
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState, ContentState, convertToRaw
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

function RichTextEditor(props){
  const blocksFromHTML = htmlToDraft(props.inputText);
  const { contentBlocks, entityMap } = blocksFromHTML;
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));

  // an effect to update editorState whenever props.role || props.selectedLanguage changes
  useEffect(() => {
    setEditorState(EditorState.createWithContent(contentState));

  }, [props.role, props.selectedLanguage]);
  
  props.richTextEditorValueHandler(draftToHtml(convertToRaw(editorState.getCurrentContent())));

  return (
    <React.Fragment>
      <Editor 
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        editorState={editorState}
        onEditorStateChange={setEditorState}
        placeholder={props.placeholder}
      />
    </React.Fragment>
  );
}

RichTextEditor.propTypes = {
  inputText: PropTypes.any,
  role: PropTypes.any,
  selectedLanguage: PropTypes.string,
  richTextEditorValueHandler: PropTypes.func,
  placeHolder: PropTypes.string
};

export default RichTextEditor;
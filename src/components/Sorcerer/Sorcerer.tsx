import React, { useEffect, useState } from "react";
import Title from "../Title/Title";
import Button from "../Button/Button";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import MyEditor from "../MyEditor/MyEditor";

import { sorcererContainerClass } from "./styles";

const Sorcerer = (): React.ReactElement => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem("editorContent");
      if (savedContent) {
        const contentState = convertFromRaw(JSON.parse(savedContent));
        setEditorState(EditorState.createWithContent(contentState));
      }
    } catch (error) {
      console.error("Error loading editor content:", error);
    }
  }, []);

  const onClickSave = (): void => {
    const contentState = editorState.getCurrentContent();
    const contentJSON = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("editorContent", contentJSON);
  };

  return (
    <div className={sorcererContainerClass}>
      <div className="flex items-center justify-between">
        <Title />
        <Button onClickSave={onClickSave} />
      </div>
      <MyEditor editorState={editorState} setEditorState={setEditorState} />
    </div>
  );
};
export default Sorcerer;

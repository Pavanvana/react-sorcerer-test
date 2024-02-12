import React, { useState } from "react";
import {
  EditorState,
  Editor,
  RichUtils,
  DraftHandleValue,
  convertToRaw,
  getDefaultKeyBinding,
  ContentState,
  Modifier,
  SelectionState,
} from "draft-js";
import { CustomBoardTypes } from "../../types/customBoardTypes";

import { editorContainerClass, placeHolderTextClass } from "./styles";
import "draft-js/dist/Draft.css";

interface Props {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
}

const MyEditor = (props: Props): React.ReactElement => {
  const { editorState, setEditorState } = props;

  const [isEditorFocused, setIsEditorFocused] = useState(false);

  const handleFocus = (): void => {
    setIsEditorFocused(true);
  };

  const handleBlur = (): void => {
    if (editorState.getCurrentContent().hasText()) return;
    setIsEditorFocused(false);
  };

  const handleKeyCommand = (command: string): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  // const handleEmptyLine = () => {
  //   const emptyText = "";
  //   const newContentState = ContentState.createFromText(emptyText);
  //   const newEditorState = EditorState.push(
  //     editorState,
  //     newContentState,
  //     "insert-characters"
  //   );
  //   setEditorState(newEditorState);
  //   // setEditorState(RichUtils.toggleBlockType(editorState, "unstyled"));
  // };

  const toggleBlockType = (blockType: string): void => {
    if (blockType === CustomBoardTypes.HEADER) {
      return setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    }
    return setEditorState(RichUtils.toggleInlineStyle(editorState, blockType));
  };

  const handleGetTextWithNewLines = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const textWithNewLines = rawContentState.blocks.map((block) => {
      return block.text;
    });
    return textWithNewLines[textWithNewLines.length - 1];
  };

  const handleBeforeInput = (chars: string): DraftHandleValue => {
    const isValidChar =
      chars === " " &&
      (handleGetTextWithNewLines() === "#" ||
        handleGetTextWithNewLines() === "*" ||
        handleGetTextWithNewLines() === "**" ||
        handleGetTextWithNewLines() === "***");
    if (isValidChar) {
      switch (handleGetTextWithNewLines()) {
        case "#":
          toggleBlockType(CustomBoardTypes.HEADER);
          break;
        case "*":
          toggleBlockType(CustomBoardTypes.BOLD);
          break;
        case "**":
          toggleBlockType(CustomBoardTypes.RED_LINE);
          break;
        case "***":
          toggleBlockType(CustomBoardTypes.UNDERLINE);
          break;
        default:
          toggleBlockType(CustomBoardTypes.UNSTYLED);
      }
      return "handled";
    }
    return "not-handled";
  };

  const handleSetUnstyled = () => {
    console.log("Enter key");
    setEditorState(RichUtils.toggleBlockType(editorState, "unstyled"));
  };

  const keyBindingFn = (e: any) => {
    if (e.keyCode === 13) {
      handleSetUnstyled();
    }
    return getDefaultKeyBinding(e);
  };

  const customStyleMap = {
    RED_LINE: {
      color: "red",
    },
  };

  const handleReturn = (
    e: React.KeyboardEvent<{}>,
    editorState: EditorState
  ): "handled" | "not-handled" => {
    if (!e.shiftKey) {
      setEditorState(RichUtils.toggleBlockType(editorState, "unstyled"));
      return "handled";
    }
    return "not-handled";
  };

  const getCurrentBlockType = () => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const block = currentContent.getBlockForKey(selection.getStartKey());
    return block.getType();
  };

  const isTextStyleHeader = getCurrentBlockType() === CustomBoardTypes.HEADER;

  return (
    <div className={editorContainerClass} style={{ position: "relative" }}>
      <div
        className={placeHolderTextClass(
          isEditorFocused || editorState.getCurrentContent().hasText(),
          isTextStyleHeader
        )}
      >
        Enter your Text...
      </div>
      <div className="border border-solid border-gray-300 rounded-lg p-2">
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          handleBeforeInput={handleBeforeInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          customStyleMap={customStyleMap}
          keyBindingFn={keyBindingFn}
          // handleReturn={handleReturn}
        />
      </div>
    </div>
  );
};
export default MyEditor;

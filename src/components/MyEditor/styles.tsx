export const editorContainerClass =
  "w-full min-h-70vh border border-solid border-gray-300 rounded-lg p-6 bg-gray-100 relative";

export const placeHolderTextClass = (
  isEditorFocused: boolean,
  isTextStyleHeader: boolean
) =>
  `absolute pointer-events-none font-sans font-normal text-gray-500 ${
    isEditorFocused ? "hidden" : "block"
  } ${isTextStyleHeader ? "top-14 left-8 text-xl" : "top-8 left-8"}`;

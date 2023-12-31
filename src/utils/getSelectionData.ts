const getSelectionData = () => {
  const selection = document.getSelection();
  const selectedText = selection?.toString();
  if (selectedText === " " || !selectedText || selection === null) return;
  let range;
  let rec;
  const parent = selection?.anchorNode?.parentElement;
  range = selection?.getRangeAt(0);
  const isOneLine = range.startContainer === range.endContainer;
  rec = range?.getBoundingClientRect();
  console.log("Range: ", range);

  return {
    rec,
    parent,
    range,
    startContainer: range.startContainer,
    endContainer: range.endContainer,
    anchorNode: selection.anchorNode,
    focusNode: selection.focusNode,
    startOffset: selection.anchorOffset,
    endOffset: selection.focusOffset,
    selectedText,
    isOneLine,
    commonAncestorContainer: range.commonAncestorContainer,
  };
};

export default getSelectionData;

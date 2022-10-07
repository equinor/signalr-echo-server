const autoReziseTextarea = (textarea) => {
  const initialScrollHeight = textarea.scrollHeight;
  const reziseTextarea = () => {
    if (this.scrollHeight === initialScrollHeight) return;
    this.style.height = 0;
    this.style.height =
      (this.scrollHeight < initialScrollHeight
        ? initialScrollHeight
        : this.scrollHeight) + "px";
  };
  textarea.setAttribute(
    "style",
    `height:${initialScrollHeight}px;` +
      // `width:${payloadInput.scrollWidth};` +
      "overflow-y:hidden;"
  );
  textarea.addEventListener("input", reziseTextarea, false);
};
const formatPayload = (response) => {
  try {
    return JSON.stringify(JSON.parse(response), null, 2);
  } catch (e) {
    return response;
  }
};

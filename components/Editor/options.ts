const options = {
  inline: {
    inDropdown: false,
    options: ["bold", "italic", "underline", "monospace"]
  },
  link: {
    defaultTargetOption: "_self",
    inDropdown: true,
    options: ["link", "unlink"],
    showOpenOptionOnHover: true
  },
  list: {
    inDropdown: true,
    options: ["unordered", "ordered"]
  },
  options: ["inline", "blockType", "list", "textAlign", "link", "history"],
  textAlign: {
    inDropdown: true,
    options: ["left", "center", "right", "justify"]
  }
};

export default options;

window.document.createElement = jest.fn().mockImplementation(() => {
  const element = {};

  Object.defineProperty(element, "innerHTML", {
    /* tslint:disable object-literal-shorthand */
    set(x) {
      this.innerText = x;
    }
  });

  return element;
});

const common = {
  state: {
    documentBodyClientHeight: document.body.clientHeight,
    documentBodyClientWidth: document.body.clientWidth,
    currentTheme: {}
  },
  mutations: {
    commonInit(state) {

    },
    setDocumentBodyClientSize(state) {
      state.documentBodyClientHeight = document.body.clientHeight;
      state.documentBodyClientWidth = document.body.clientWidth;
    }
  }
};

export default common;

const types = require("../types");

const typeMap = [
  {
    name: "createStore(reducer, [preloadedState], [enhancer])",
    path: "cn.redux.js.org/docs/api/createStore.html",
    type: types.Method,
  },
  {
    name: "combineReducers(reducers)",
    path: "cn.redux.js.org/docs/api/combineReducers.html",
    type: types.Method,
  },
  {
    name: "applyMiddleware(...middlewares)",
    path: "cn.redux.js.org/docs/api/applyMiddleware.html",
    type: types.Method,
  },
  {
    name: "bindActionCreators(actionCreators, dispatch)",
    path: "cn.redux.js.org/docs/api/bindActionCreators.html",
    type: types.Method,
  },
  {
    name: "compose(...functions)",
    path: "cn.redux.js.org/docs/api/compose.html",
    type: types.Method,
  },
  {
    name: "Store",
    path: "cn.redux.js.org/docs/api/Store.html",
    type: types.Object,
  },
  {
    name: "getState()",
    path: "cn.redux.js.org/docs/api/Store.html#getState",
    type: types.Method,
  },
  {
    name: "dispatch(action)",
    path: "cn.redux.js.org/docs/api/Store.html#dispatch",
    type: types.Method,
  },
  {
    name: "subscribe(listener)",
    path: "cn.redux.js.org/docs/api/Store.html#subscribe",
    type: types.Method,
  },
  {
    name: "getReducer()",
    path: "cn.redux.js.org/docs/api/Store.html#getReducer",
    type: types.Method,
  },
  {
    name: "replaceReducer(nextReducer)",
    path: "cn.redux.js.org/docs/api/Store.html#replaceReducer",
    type: types.Method,
  },
  {
    name: "<Provider store>",
    path: "cn.redux.js.org/docs/react-redux/api.html#provider-store",
    type: types.Component,
  },
  {
    name:
      "connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])",
    path:
      "cn.redux.js.org/docs/react-redux/api.html#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options",
    type: types.Method,
  },
  {
    name: "connectAdvanced(selectorFactory, [connectOptions])",
    path:
      "cn.redux.js.org/docs/react-redux/api.html#connectadvancedselectorfactory-connectoptions",
    type: types.Method,
  },
  {
    name: "createProvider([storeKey])",
    path: "cn.redux.js.org/docs/react-redux/api.html#createproviderstorekey",
    type: types.Method,
  },
];

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {
  $("body script").remove();
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  if ($("head title").text().trim() === "Page not found · GitHub Pages") {
    return;
  }
  let title = $(".markdown-section h1").text().trim();
  if (title === "") {
    title = $(".markdown-section h2").text().trim();
  }
  insertToDb({
    name: title,
    type: types.Guide,
    path: relativePath,
  });
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "redux",
  displayName: "Redux",
  platformFamily: "Redux",
  entry: "cn.redux.js.org/index.html",
  domain: "cn.redux.js.org",
  include: [],
  exclude: [],
  indexGenerator: [
    {
      file: "index.html",
      generateToc: function ({
        $,
        relativePath,
        addDashAnchor,
        insertToDb,
        docset,
      }) {
        for (const item of typeMap) {
          insertToDb({
            name: item.name,
            type: item.type,
            path: item.path,
          });
        }
      },
    },
  ],
  generator: [
    {
      pattern: /.*/g,
      beforeGenerateToc,
      generateToc,
      filter,
      beforeFilter,
      afterFilter,
    },
  ],
};

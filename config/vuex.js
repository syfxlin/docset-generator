const types = require("../types");

const extractTitle = function (element) {
  return Array.from(element.childNodes)
    .map((node) => node.data)
    .join("")
    .replace("#", "")
    .trim();
};

const collectH3 = function (element) {
  let h3s = [];
  let next = element.nextSibling;
  while (next && next.tagName !== "h2") {
    if (next.tagName === "h3") {
      h3s.push(next);
    }
    next = next.nextSibling;
  }
  return h3s;
};

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {
  $(".sidebar").remove();
  $(".page").removeClass("page");
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  let isApi = relativePath.indexOf("guide") === -1;
  let h1Title = "";
  if (!isApi) {
    $("h1").each((index, element) => {
      h1Title = extractTitle(element);
      insertToDb({
        name: h1Title,
        type: docset.types.guide,
        path: relativePath,
      });
    });
    $("h3").each((index, element) => {
      let title = extractTitle(element);
      let type = docset.types.h2;
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: type,
        num: 0,
      });
      insertToDb({
        name: `${title} - ${h1Title}`,
        type: type,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
      console.log(`${title}: ${type}`);
    });
  } else {
    $("h2").each((index, element) => {
      let title = extractTitle(element);
      let type = docset.types[title];
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: type,
        num: 1,
      });

      insertToDb({
        name: title,
        type: docset.types.guide,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
      console.log(`${title}: ${docset.types.guide}`);

      let h3s = collectH3(element);
      h3s.forEach((h3Element) => {
        let h3Title = extractTitle(h3Element);
        addDashAnchor({
          element: h3Element,
          title: h3Element.attribs.id,
          type: type,
          num: 0,
        });
        insertToDb({
          name: h3Title,
          type: type,
          path: `${relativePath}#${encodeURIComponent(h3Element.attribs.id)}`,
        });
        console.log(`${h3Title}: ${type}`);
      });
    });
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {
  $("body script").each((index, item) => {
    $(item).remove();
  });
};

module.exports = {
  name: "vuex",
  displayName: "Vuex",
  platformFamily: "Vuex",
  entry: "vuex.vuejs.org/zh/index.html",
  domain: "vuex.vuejs.org/zh",
  include: ["api", "guide", "index.html", "installation.html"],
  exclude: [],
  replace: {},
  beforeGenerateToc,
  generateToc,
  filter,
  beforeFilter,
  afterFilter,
  types: {
    "Vuex.Store": types.Constructor,
    "Vuex.Store 构造器选项": types.Parameter,
    "Vuex.Store 实例属性": types.Property,
    "Vuex.Store 实例方法": types.Method,
    组件绑定的辅助函数: types.Function,
    h2: types.Section,
    guide: types.Guide,
  },
};

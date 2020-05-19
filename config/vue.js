const types = require("../types");

const extractTitle = function (element) {
  let title = Array.from(element.childNodes)
    .map((node) => node.data)
    .join("")
    .trim();
  element.innerHTML = title;
  return title.replace(/\([^(]*\)/g, "");
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

const beforeParse = function ({ path, html }) {
  return html;
};

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {
  $(".navbar").remove();
  $(".sidebar").remove();
  $(".with-sidebar").removeClass("with-sidebar");
  $("#ad").remove();
  $("#header").remove();
  $(".ad-pagetop").remove();
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  let h1Title = "";
  if (relativePath.indexOf("style-guide") !== -1) {
    $("h2").each((index, element) => {
      let title = extractTitle(element);
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: docset.types.style,
        num: 2,
      });

      insertToDb({
        name: title,
        type: docset.types.style,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
      console.log(`${title}: ${docset.types.style}`);
    });
  } else if (
    relativePath.indexOf("guide") !== -1 ||
    relativePath.indexOf("cookbook") !== -1
  ) {
    $("h1").each((index, element) => {
      h1Title = extractTitle(element);
      if (relativePath.indexOf("cookbook") !== -1 && h1Title === "介绍") {
        return;
      }
      insertToDb({
        name: h1Title,
        type: docset.types.guide,
        path: relativePath,
      });
    });
    $("h2").each((index, element) => {
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
  } else if (relativePath.indexOf("api") !== -1) {
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
          num: 1,
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
  name: "vue",
  displayName: "Vue",
  platformFamily: "VueJS",
  entry: "cn.vuejs.org/index.html",
  domain: "cn.vuejs.org/v2",
  include: ["api", "guide", "cookbook", "index.html"],
  exclude: [],
  replace: {},
  beforeParse,
  beforeGenerateToc,
  generateToc,
  filter,
  beforeFilter,
  afterFilter,
  types: {
    属性: types.Property,
    全局配置: types.Property,
    "全局 API": types.Method,
    "选项 / 数据": types.Option,
    "选项 / DOM": types.Option,
    "选项 / 生命周期钩子": types.Option,
    "选项 / 资源": types.Option,
    "选项 / 组合": types.Option,
    "选项 / 其它": types.Option,
    "实例 property": types.Property,
    "实例方法 / 数据": types.Method,
    "实例方法 / 事件": types.Method,
    "实例方法 / 生命周期": types.Method,
    指令: types.Directive,
    "特殊 attribute": types.Attribute,
    内置的组件: types.Component,
    "VNode 接口": types.Component,
    服务端渲染: types.Component,
    h2: types.Section,
    guide: types.Guide,
    style: types.Style,
  },
};

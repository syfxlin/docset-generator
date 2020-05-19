const types = require("../types");

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  let h1 = $("h1");
  let title = h1.text();
  if (
    title === "" ||
    (h1.prev().length > 0 && h1.prev()[0].tagName === "strong")
  ) {
    title = $("h2").text();
  }
  let type = undefined;
  let classSyn = $(".classsynopsis");
  if (classSyn.length > 0) {
    if (!/接口|interface/g.test(title)) {
      title = title.replace(/类|The|class|\([^)]*\)|（[^）]*）/g, "");
      type = types.Class;
    } else {
      title = title.replace(/接口|The|interface|\([^)]*\)|（[^）]*）/g, "");
      type = types.Interface;
    }
  } else if (title.indexOf("::") !== -1) {
    type = types.Method;
  } else if (relativePath.startsWith("function.")) {
    type = types.Function;
  } else if (
    relativePath.startsWith("control-structures.") &&
    relativePath !== "control-structures.intro.html"
  ) {
    type = types.Keyword;
  } else if (
    relativePath.startsWith("language.types.") &&
    relativePath !== "language.types.html" &&
    relativePath !== "language.types.intro.html"
  ) {
    type = types.Type;
  } else if (relativePath.startsWith("language.operators.")) {
    type = types.Operator;
  } else if (
    relativePath.startsWith("reserved.variables.") &&
    relativePath !== "reserved.variables.html"
  ) {
    type = types.Variable;
  } else if (relativePath.startsWith("wrappers.")) {
    type = types.Protocol;
  } else if (
    relativePath.endsWith("constants.html") &&
    relativePath !== "internals2.pdo.constants.html"
  ) {
    type = types.Constant;
  } else if (
    relativePath.startsWith("language.") ||
    relativePath.startsWith("install.") ||
    relativePath.startsWith("security.") ||
    relativePath.startsWith("features.") ||
    relativePath.startsWith("faq.")
  ) {
    type = types.Guide;
  }
  if (type === undefined) {
    return;
  }
  title = title.trim();
  if (type === types.Class || type === types.Interface) {
    insertToDb({
      name: title,
      type: type,
      path: `${relativePath}`,
    });

    $('[id$="props"] dt').each((index, element) => {
      let propName = `${title}::${$(element).text().trim()}`;
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Property,
        num: 0,
      });

      insertToDb({
        name: propName,
        type: types.Property,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
    $('[id$="constants"] dt').each((index, element) => {
      if (!element.attribs.id) {
        return;
      }
      let constName = `${$(element).text().trim()}`;
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Constant,
        num: 0,
      });

      insertToDb({
        name: constName,
        type: types.Constant,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
  } else if (type === types.Constant) {
    $("dt").each((index, element) => {
      if (!element.attribs.id) {
        return;
      }
      let constName = $(element).children("strong").text().trim();
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Constant,
        num: 0,
      });

      insertToDb({
        name: constName,
        type: types.Constant,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
  } else {
    insertToDb({
      name: title,
      type: type,
      path: `${relativePath}`,
    });
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {
  $(".navbar").remove();
};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "php",
  displayName: "PHP",
  platformFamily: "PHP",
  entry: "index.html",
  domain: "",
  include: [],
  exclude: [],
  replace: {},
  generateToc,
  filter,
  beforeFilter,
  afterFilter,
};

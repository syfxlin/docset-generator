const types = require("../types");

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  let titleElement = $(".header h1");
  if (titleElement.length > 0) {
    let title = $(titleElement).text().trim();
    if (
      title.startsWith("Package") ||
      title.startsWith("Uses of Package") ||
      title.startsWith("Hierarchy For Package") ||
      title.startsWith("模块")
    ) {
      return;
    }
    insertToDb({
      name: title,
      type: types.Guide,
      path: relativePath,
    });
    return;
  }
  let title = $(".header h2").text().trim();
  $('> a[id]:not([id="field.detail"])', $('[id="field.detail"]').parent()).each(
    (index, element) => {
      let nextElement = $(element).next();
      if (nextElement.length <= 0 || nextElement.get(0).tagName === "a") {
        return;
      }
      let fieldName = `${$("h4", nextElement).text().trim()} (${title})`;
      addDashAnchor({
        element: $("code", element),
        title: element.attribs.id,
        type: types.Field,
        num: 0,
      });
      insertToDb({
        name: fieldName,
        type: types.Field,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
      if ($("pre", $(element).next()).text().indexOf("final") !== -1) {
        addDashAnchor({
          element: $("code", element),
          title: element.attribs.id,
          type: types.Constant,
          num: 0,
        });
        insertToDb({
          name: fieldName,
          type: types.Constant,
          path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
        });
      }
    }
  );
  $(
    '> a[id]:not([id="constructor.detail"])',
    $('[id="constructor.detail"]').parent()
  ).each((index, element) => {
    let nextElement = $(element).next();
    if (nextElement.length <= 0 || nextElement.get(0).tagName === "a") {
      return;
    }
    let constructorName = `${$("h4", nextElement).text().trim()} (${title})`;
    addDashAnchor({
      element: $("code", element),
      title: element.attribs.id,
      type: types.Constructor,
      num: 0,
    });
    insertToDb({
      name: constructorName,
      type: types.Constructor,
      path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
    });
  });
  $(
    '> a[id]:not([id="method.detail"])',
    $('[id="method.detail"]').parent()
  ).each((index, element) => {
    let nextElement = $(element).next();
    if (nextElement.length <= 0 || nextElement.get(0).tagName === "a") {
      return;
    }
    let methodName = `${$("h4", nextElement).text().trim()} (${title})`;
    addDashAnchor({
      element: $("code", element),
      title: element.attribs.id,
      type: types.Method,
      num: 0,
    });
    insertToDb({
      name: methodName,
      type: types.Method,
      path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
    });
  });
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "java",
  displayName: "Java",
  platformFamily: "Java",
  entry: "index.html",
  domain: "",
  include: [],
  exclude: [],
  indexGenerator: [
    {
      file: "allpackages-index.html",
      generateToc: function ({
        $,
        relativePath,
        addDashAnchor,
        insertToDb,
        docset,
      }) {
        $(".overviewSummary th.colFirst:has(a)").each((index, element) => {
          let title = $(element).text().trim();
          insertToDb({
            name: title,
            type: types.Module,
            path: $("a:first-child", element).attr("href"),
          });
        });
      },
    },
    {
      file: "allpackages-index.html",
      generateToc: function ({
        $,
        relativePath,
        addDashAnchor,
        insertToDb,
        docset,
      }) {
        $(".packagesSummary th.colFirst:has(a)").each((index, element) => {
          let title = $(element).text().trim();
          insertToDb({
            name: title,
            type: types.Package,
            path: $("a:first-child", element).attr("href"),
          });
        });
      },
    },
    {
      file: "allclasses-index.html",
      generateToc: function ({
        $,
        relativePath,
        addDashAnchor,
        insertToDb,
        docset,
      }) {
        $(".typeSummary td.colFirst:has(a)").each((index, element) => {
          let type = $("a:first-child", element).attr("title").split(" in")[0];
          let title = $(element).text().trim();
          if (type === "interface") {
            type = types.Interface;
          } else if (type === "class") {
            if (
              title.endsWith("Exception") ||
              title.endsWith("Warning") ||
              title === "异常"
            ) {
              type = types.Exception;
            } else if (title.endsWith("Error") || title === "ThreadDeath") {
              type = types.Error;
            } else {
              type = types.Class;
            }
          } else if (type === "enum") {
            type = types.Enum;
          } else if (type === "annotation") {
            type = types.Annotation;
          }
          insertToDb({
            name: title,
            type: type,
            path: $("a:first-child", element).attr("href"),
          });
        });
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

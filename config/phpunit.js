const types = require("../types");

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {
  $(".wy-nav-side").remove();
  $(".rst-versions").remove();
  $(".wy-nav-content-wrap").removeClass("wy-nav-content-wrap");
  $(".wy-nav-content").css("max-width", "100%");
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  if (
    $("head title").text().trim().indexOf("未找到") !== -1 ||
    relativePath.endsWith("search.html") ||
    relativePath.endsWith("-2.html") ||
    relativePath.endsWith("genindex.html") ||
    relativePath.endsWith("copyright.html")
  ) {
    return;
  }
  let title = $("h1").text().trim();
  if (title.indexOf(".") !== -1) {
    title = title.split(". ")[1];
  }
  if (relativePath.endsWith("assertions.html")) {
    title = "断言方法";
  } else if (relativePath.endsWith("annotations.html")) {
    title = "注解";
  }
  insertToDb({
    name: title,
    type: types.Guide,
    path: relativePath,
  });
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {
  $("body script").each((index, item) => {
    $(item).remove();
  });
};

module.exports = {
  name: "phpunit",
  displayName: "PHPUnit",
  platformFamily: "PHPUnit",
  entry: "phpunit.readthedocs.io/zh_CN/latest/index.html",
  domain: "phpunit.readthedocs.io/zh_CN/latest",
  include: [],
  exclude: [],
  indexGenerator: [
    {
      file: "assertions.html",
      generateToc: function ({
        $,
        relativePath,
        addDashAnchor,
        insertToDb,
        docset,
      }) {
        $(".section").each((index, element) => {
          if (index === 0) {
            return;
          }
          insertToDb({
            name: $("h1", element).text().trim().split(". ")[1],
            type: types.Method,
            path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
          });
        });
      },
    },
    {
      file: "annotations.html",
      generateToc: function ({
        $,
        relativePath,
        addDashAnchor,
        insertToDb,
        docset,
      }) {
        $(".section").each((index, element) => {
          if (index === 0) {
            return;
          }
          insertToDb({
            name: $("h1", element).text().trim().split(". ")[1],
            type: types.Annotation,
            path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
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

const types = require("../types");

let walked = [];

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {
  $(".page-header").remove();
  $(".document-toc-container").remove();
  $(".sidebar").remove();
  $(".newsletter-container").remove();
  $(".nav-footer").remove();
  $(".wiki-left-present").removeClass("wiki-left-present");
  $("body script").remove();
  $("body").append(`
<script>
  document.querySelector("#header-language-menu").addEventListener("click", function() {
    document.querySelector("#language-menu").classList.toggle("show");
  })
</script>
  `);
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  if (
    $("head title").text().trim() === "找不到页面 | MDN" ||
    relativePath.endsWith("-2.html")
  ) {
    return;
  }
  let shortPath = relativePath.replace(
    "developer.mozilla.org/zh-CN/docs/Web/HTTP/",
    ""
  );
  let title = $(".titlebar h1").text().trim();
  if (shortPath.startsWith("Methods/")) {
    insertToDb({
      name: title,
      type: types.Method,
      path: relativePath,
    });
  } else if (shortPath.startsWith("Headers/")) {
    if (shortPath.indexOf("-Policy/") !== -1) {
      insertToDb({
        name: title,
        type: types.Directive,
        path: relativePath,
      });
    } else {
      insertToDb({
        name: title,
        type: types.Option,
        path: relativePath,
      });
    }
  } else if (shortPath.startsWith("Status/")) {
    insertToDb({
      name: title,
      type: types.Constant,
      path: relativePath,
    });
  } else if (shortPath.startsWith("CORS/Errors/")) {
    insertToDb({
      name: title,
      type: types.Error,
      path: relativePath,
    });
  } else {
    insertToDb({
      name: title,
      type: types.Guide,
      path: relativePath,
    });
  }
  if (shortPath === "Basics_of_HTTP/MIME_types/Common_types.html") {
    $("#wikiArticle tr td:first-child:has(code)").each((index, element) => {
      let typeTitle = $(element).text().trim();
      addDashAnchor({
        element: $("code", element),
        title: typeTitle,
        type: types.Type,
        num: 0,
      });
      insertToDb({
        name: typeTitle,
        type: types.Type,
        path: `${relativePath}#${encodeURIComponent(typeTitle)}`,
      });
    });
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "http",
  displayName: "HTTP",
  platformFamily: "HTTP",
  entry: "developer.mozilla.org/zh-CN/docs/Web/HTTP.html",
  domain: "developer.mozilla.org/zh-CN/docs/Web",
  include: [],
  exclude: [],
  indexGenerator: [],
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

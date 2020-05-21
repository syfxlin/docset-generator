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

const generateTocByIndex = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  $("li a:has(code)").each((index, element) => {
    let title = $(element).text().trim();
    let docPath =
      element.attribs.href.indexOf("http") !== -1
        ? element.attribs.href
        : `developer.mozilla.org/zh-CN/docs/Web/CSS/${element.attribs.href}`;
    // 记录已经走过
    walked.push(docPath);
    if (title.indexOf("::") !== -1) {
      insertToDb({
        name: title,
        type: types.Element,
        path: docPath,
      });
    } else if (title.indexOf(":") !== -1) {
      insertToDb({
        name: title,
        type: types.Class,
        path: docPath,
      });
    } else if (title.indexOf("@") !== -1) {
      insertToDb({
        name: title,
        type: types.Function,
        path: docPath,
      });
    } else if (title.indexOf("()") !== -1) {
      insertToDb({
        name: title,
        type: types.Function,
        path: docPath,
      });
    } else if (title.indexOf("<") !== -1) {
      insertToDb({
        name: title.replace(/[<>]/g, ""),
        type: types.Type,
        path: docPath,
      });
    } else {
      insertToDb({
        name: title,
        type: types.Property,
        path: docPath,
      });
    }
  });
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  if (
    walked.findIndex((item) => decodeURIComponent(item) === relativePath) !==
      -1 ||
    $("head title").text().trim() === "找不到页面 | MDN" ||
    relativePath.endsWith("-2.html")
  ) {
    return;
  }
  let title = $(".titlebar h1").text().trim();
  let isGuide = /使用|选择器|查询|文本|CSS/g.test(title);
  let bcdElement = $(
    '[id^="bcd:"], h2:contains(兼容性), h2:contains(compatibility)'
  );
  if ((!isGuide && bcdElement.length > 0) || /-moz|-ms|-webkit/g.test(title)) {
    if (title.indexOf("::") !== -1) {
      insertToDb({
        name: title,
        type: types.Element,
        path: relativePath,
      });
    } else if (title.indexOf(":") !== -1) {
      insertToDb({
        name: title,
        type: types.Class,
        path: relativePath,
      });
    } else if (title.indexOf("@") !== -1) {
      insertToDb({
        name: title,
        type: types.Function,
        path: relativePath,
      });
    } else if (title.indexOf("()") !== -1) {
      insertToDb({
        name: title,
        type: types.Function,
        path: relativePath,
      });
    } else if (title.indexOf("<") !== -1) {
      insertToDb({
        name: title.replace(/[<>]/g, ""),
        type: types.Type,
        path: relativePath,
      });
    } else {
      insertToDb({
        name: title,
        type: types.Property,
        path: relativePath,
      });
    }
  } else {
    insertToDb({
      name: title,
      type: types.Guide,
      path: relativePath,
    });
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "css",
  displayName: "CSS",
  platformFamily: "CSS",
  entry: "developer.mozilla.org/zh-CN/docs/Web/CSS/Reference.html",
  domain: "developer.mozilla.org/zh-CN/docs/Web/CSS",
  include: [],
  exclude: [],
  indexGenerator: [
    {
      file: "Reference.html",
      beforeGenerateToc,
      generateToc: generateTocByIndex,
      filter,
      beforeFilter,
      afterFilter,
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

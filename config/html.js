const types = require("../types");

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
  if ($("head title").text().trim() === "找不到页面 | MDN") {
    return;
  }
  let title = $(".titlebar h1").text().trim();
  if (
    relativePath.startsWith(
      "developer.mozilla.org/zh-CN/docs/Web/HTML/Element"
    ) &&
    relativePath !== "developer.mozilla.org/zh-CN/docs/Web/HTML/Element.html"
  ) {
    if (title.indexOf(">") !== -1) {
      title = title.substring(0, title.indexOf(">") + 1);
    }
    insertToDb({
      name: title,
      type: types.Tag,
      path: relativePath,
    });
    $('strong[id^="attr-"]').each((index, element) => {
      let attrName = `${$("code", element).text().trim()} (${title})`;
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Attribute,
        num: 0,
      });
      insertToDb({
        name: attrName,
        type: types.Attribute,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
  } else if (
    relativePath.startsWith(
      "developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes"
    ) &&
    relativePath !==
      "developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes"
  ) {
    insertToDb({
      name: title,
      type: types.Attribute,
      path: relativePath,
    });
  } else if (
    relativePath
      .replace("developer.mozilla.org/zh-CN/docs/Web/HTML/", "")
      .indexOf("/") === -1
  ) {
    insertToDb({
      name: title,
      type: types.Guide,
      path: relativePath,
    });

    if (
      relativePath ===
      "developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types.html"
    ) {
      $("#wikiArticle table:first-child tr").each((index, element) => {
        let tdElement = $(element).children().first();
        let linkName = tdElement.text().trim();
        addDashAnchor({
          element: $(tdElement).children().first(),
          title: linkName,
          type: types.Type,
          num: 0,
        });

        insertToDb({
          name: linkName,
          type: types.Type,
          path: `${relativePath}#${encodeURIComponent(linkName)}`,
        });
      });
    }
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "html",
  displayName: "HTML",
  platformFamily: "HTML",
  entry: "developer.mozilla.org/zh-CN/docs/Web/HTML/Reference.html",
  domain: "developer.mozilla.org/zh-CN/docs/Web/HTML",
  include: [],
  exclude: [],
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

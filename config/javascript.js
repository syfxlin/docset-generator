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

const generateTocByJS = function ({
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
    relativePath.endsWith("-2.html") ||
    relativePath.endsWith("-3.html") ||
    relativePath.endsWith("-4.html")
  ) {
    return;
  }
  let title = $(".titlebar h1").text().trim();
  if (title.indexOf("Error:") !== -1 || title.indexOf("Warning:") !== -1) {
    insertToDb({
      name: title,
      type: types.Error,
      path: relativePath,
    });
  } else if (
    title.endsWith("constructor") ||
    title.endsWith("构造函数") ||
    title.endsWith("构造器")
  ) {
    insertToDb({
      name: title.replace(/constructor|构造函数|构造器/g, "").trim(),
      type: types.Constructor,
      path: relativePath,
    });
  } else if (
    title.endsWith("()") ||
    title.startsWith("get ") ||
    title.startsWith("set ") ||
    title.endsWith("]")
  ) {
    insertToDb({
      name: title,
      type: types.Method,
      path: relativePath,
    });
  } else if (title.indexOf(".") !== -1 && title.indexOf("新特性") === -1) {
    insertToDb({
      name: title,
      type: types.Property,
      path: relativePath,
    });
  } else if (relativePath.indexOf("/Global_Objects/") !== -1) {
    insertToDb({
      name: title,
      type: types.Class,
      path: relativePath,
    });
  } else if (
    relativePath.indexOf("/Operators/") !== -1 ||
    relativePath.indexOf("/Statements/") !== -1
  ) {
    insertToDb({
      name: title,
      type: types.Keyword,
      path: relativePath,
    });
  } else {
    insertToDb({
      name: title,
      type: types.Guide,
      path: relativePath,
    });
  }
};

const generateTocByAPI = function ({
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
    relativePath.endsWith("-2.html") ||
    relativePath.endsWith("-3.html") ||
    relativePath.endsWith("-4.html") ||
    relativePath ===
      "developer.mozilla.org/zh-CN/docs/Web/API/支付_请求_接口/Concepts.html" ||
    relativePath === "developer.mozilla.org/zh-CN/docs/Web/API/MIDIPorts.html"
  ) {
    return;
  }
  let shortPath = relativePath.replace(
    "developer.mozilla.org/zh-CN/docs/Web/API/",
    ""
  );
  let title = $(".titlebar h1").text().trim();
  if (
    shortPath.indexOf("API") !== -1 ||
    shortPath.indexOf("Tutorial") !== -1 ||
    shortPath.indexOf("Using") !== -1 ||
    shortPath.startsWith("Document_Object_Model") ||
    [
      "Touch_events.html",
      "Pointer_events.html",
      "XMLHttpRequest/Sending_and_Receiving_Binary_Data.html",
      "Touch_events/Supporting_both_TouchEvent_and_MouseEvent.html",
      "XMLHttpRequest/Synchronous_and_Asynchronous_Requests.html",
      "Touch_events/Multi-touch_interaction.html",
      "支付_请求_接口.html",
    ].includes(shortPath)
  ) {
    insertToDb({
      name: title,
      type: types.Guide,
      path: relativePath,
    });
  } else if (shortPath.endsWith("_event.html")) {
    let titleSplit = title.split(": ");
    let eventName;
    let parentName;
    if (titleSplit.length === 1) {
      eventName = titleSplit[0];
      let pathSplit = relativePath.split("/");
      parentName = pathSplit[pathSplit.length - 2];
    } else {
      eventName = titleSplit[1];
      parentName = titleSplit[0];
    }
    insertToDb({
      name: `${eventName} (${parentName})`,
      type: types.Event,
      path: relativePath,
    });
  } else if (title.startsWith("Location: ")) {
    let titleSplit = title.split(": ");
    insertToDb({
      name: `${titleSplit[1]} (${titleSplit[0]})`,
      type: types.Field,
      path: relativePath,
    });
  } else if (title.endsWith("()")) {
    if (title.indexOf(".") !== -1) {
      insertToDb({
        name: title,
        type: types.Method,
        path: relativePath,
      });
    } else {
      insertToDb({
        name: title,
        type: types.Constructor,
        path: relativePath,
      });
    }
  } else if (title.indexOf(".") !== -1) {
    insertToDb({
      name: title,
      type: types.Property,
      path: relativePath,
    });
  } else {
    insertToDb({
      name: title,
      type: types.Class,
      path: relativePath,
    });
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const generateTocByObject = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  $("#wikiArticle li a:has(code)").each((index, element) => {
    let title = $(element).text().trim();
    let docPath =
      element.attribs.href.indexOf("http") !== -1
        ? element.attribs.href
        : `developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/${element.attribs.href}`;
    // 记录已经走过
    walked.push(docPath);
    if (
      ["Infinity", "NaN", "null", "undefined", "globalThis"].includes(title)
    ) {
      insertToDb({
        name: title,
        type: types.Value,
        path: docPath,
      });
    } else if (title.endsWith("()")) {
      insertToDb({
        name: title,
        type: types.Function,
        path: docPath,
      });
    } else {
      insertToDb({
        name: title,
        type: types.Class,
        path: docPath,
      });
    }
  });
};

const generateTocByKeyword = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  $("#wikiArticle dt a:has(code)").each((index, element) => {
    let title = $(element).text().trim();
    let docPath =
      element.attribs.href.indexOf("http") !== -1
        ? element.attribs.href
        : `developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/${element.attribs.href}`;
    // 记录已经走过
    walked.push(docPath);
    insertToDb({
      name: title,
      type: types.Keyword,
      path: docPath,
    });
  });
};

module.exports = {
  name: "javascript",
  displayName: "JavaScript",
  platformFamily: "JavaScript",
  entry: "developer.mozilla.org/zh-CN/docs/Web/JavaScript.html",
  domain: "developer.mozilla.org/zh-CN/docs/Web",
  include: [],
  exclude: [],
  indexGenerator: [
    {
      file: "JavaScript/Reference/Global_Objects.html",
      generateToc: generateTocByObject,
    },
    {
      file: "JavaScript/Reference/Statements.html",
      generateToc: generateTocByKeyword,
    },
    {
      file: "JavaScript/Reference/Operators.html",
      generateToc: generateTocByKeyword,
    },
    // {
    //   file: "API.html",
    //   generateToc: function ({
    //     $,
    //     relativePath,
    //     addDashAnchor,
    //     insertToDb,
    //     docset,
    //   }) {
    //     $("a", $("#规范").nextAll("div:has(.index)").get(0)).each(
    //       (index, element) => {
    //         let title = $(element).text().trim();
    //         let docPath =
    //           element.attribs.href.indexOf("http") !== -1
    //             ? element.attribs.href
    //             : `developer.mozilla.org/zh-CN/docs/Web/${element.attribs.href}`;
    //         walked.push(docPath);
    //         insertToDb({
    //           name: title,
    //           type: types.Guide,
    //           path: docPath,
    //         });
    //       }
    //     );
    //     $("a", $("#接口").nextAll("div:has(.index)").get(0)).each(
    //       (index, element) => {
    //         let title = $(element).text().trim();
    //         let docPath =
    //           element.attribs.href.indexOf("http") !== -1
    //             ? element.attribs.href
    //             : `developer.mozilla.org/zh-CN/docs/Web/${element.attribs.href}`;
    //         walked.push(docPath);
    //         insertToDb({
    //           name: title,
    //           type: types.Class,
    //           path: docPath,
    //         });
    //       }
    //     );
    //   },
    // },
  ],
  generator: [
    {
      pattern: /developer\.mozilla\.org\/zh-CN\/docs\/Web\/[^/]*\.html/g,
      beforeGenerateToc,
      generateToc: function () {},
    },
    {
      pattern: /developer\.mozilla\.org\/zh-CN\/docs\/Web\/JavaScript/g,
      beforeGenerateToc,
      generateToc: generateTocByJS,
      filter,
      beforeFilter,
      afterFilter,
    },
    {
      pattern: /developer\.mozilla\.org\/zh-CN\/docs\/Web\/API/g,
      beforeGenerateToc,
      generateToc: generateTocByAPI,
      filter,
      beforeFilter,
      afterFilter,
    },
  ],
};

const path = require("path");
const types = require("../types");

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {
  if (relativePath.startsWith("learnku.com")) {
    $(".sidebar").remove();
    $(".navigator").remove();
  } else {
    $("#left-column").remove();
    $("#right-column").attr("id", "");
  }
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  if (relativePath.startsWith("learnku.com")) {
    if (path.basename(relativePath).length !== 9) {
      return;
    }
    insertToDb({
      name: $(".content-body h1").text().trim(),
      type: types.Guide,
      path: relativePath,
    });
  } else if (!relativePath.startsWith("laravel.com/api/7.x/Illuminate")) {
    if (
      relativePath.endsWith("index.html") ||
      relativePath.endsWith("index-2.html")
    ) {
      return;
    }
    insertToDb({
      name: $("h1").text().trim(),
      type: types.Guide,
      path: relativePath,
    });
  } else {
    let type = $(".namespace-breadcrumbs .label-default").text().trim();
    let title = $(".namespace-breadcrumbs").text().replace(type, "").trim();
    if (type === "class") {
      type = types.Class;
    } else if (type === "interface") {
      type = types.Interface;
    } else if (type === "Namespace") {
      type = types.Namespace;
      title = title.substring(0, title.length - 1);
    } else if (type === "trait") {
      type = types.Trait;
    }
    insertToDb({
      name: title,
      type: type,
      path: relativePath,
    });
    if (
      type === types.Class ||
      type === types.Trait ||
      type === types.Interface
    ) {
      $('[id^="property_"]').each((index, element) => {
        let propName = `${title}::${$(element).next().text().trim()}`;
        addDashAnchor({
          element,
          title: element.attribs.id,
          type: types.Property,
          num: 1,
        });

        insertToDb({
          name: propName,
          type: types.Property,
          path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
        });
      });
      $('[id^="method_"]').each((index, element) => {
        let methodName = `${title}::${$("strong", element)}`;
        addDashAnchor({
          element,
          title: element.attribs.id,
          type: types.Method,
          num: 1,
        });

        insertToDb({
          name: methodName,
          type: types.Method,
          path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
        });
      });
      let constTitle = $('h2:contains("Constants")');
      if (constTitle.length > 0) {
        $("tr", constTitle.next()).each((index, element) => {
          let tdElement = $(element).children().first();
          let name = tdElement.text().trim();
          let constName = `${title}::${name}`;
          addDashAnchor({
            element: $(tdElement).next().children().first(),
            title: name,
            type: types.Constant,
            num: 1,
          });

          insertToDb({
            name: constName,
            type: types.Constant,
            path: `${relativePath}#${encodeURIComponent(name)}`,
          });
        });
      }
    }
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "laravel",
  displayName: "Laravel",
  platformFamily: "Laravel",
  entry: "learnku.com/docs/laravel/7.x/index.html",
  domain: ["learnku.com/docs/laravel/7.x", "laravel.com/api/7.x"],
  include: [],
  exclude: [],
  replace: {},
  beforeGenerateToc,
  generateToc,
  filter,
  beforeFilter,
  afterFilter,
};

const types = require("../types");

const beforeGenerateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  docset,
}) {
  $("footer").remove();
  $("article + div").remove();
  $("head").append(`
<style>
p {
    max-width: 100% !important;
}
</style>
  `);
};

const generateToc = function ({
  $,
  relativePath,
  addDashAnchor,
  insertToDb,
  docset,
}) {
  let shortPath = relativePath.replace("zh-hans.reactjs.org/docs/", "");
  let h1Title = $("h1").text().trim();
  if (shortPath === "hooks-reference.html") {
    $("h3:has(code)").each((index, element) => {
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Function,
        num: 1,
      });

      insertToDb({
        name: $(element).text().trim(),
        type: types.Function,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
  } else if (shortPath === "react-api.html") {
    $("#reference")
      .nextAll("h3:has(code)")
      .each((index, element) => {
        let title = $(element).text().trim();
        let type = types.Component;
        if (/[a-z]/g.test(title.replace("React.", "")[0])) {
          title = `${title} (React)`;
          type = types.Method;
        }
        addDashAnchor({
          element,
          title: element.attribs.id,
          type: type,
          num: 1,
        });

        insertToDb({
          name: title,
          type: type,
          path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
        });
      });
  } else if (
    [
      "react-component.html",
      "react-dom.html",
      "react-dom-server.html",
    ].includes(shortPath)
  ) {
    $("#reference")
      .nextAll("h3:has(code)")
      .each((index, element) => {
        let title = `${$(element).text().trim()} (${h1Title})`;
        let type = types.Property;
        if (title.indexOf("()") !== -1) {
          type = types.Method;
        }
        addDashAnchor({
          element,
          title: element.attribs.id,
          type: type,
          num: 1,
        });

        insertToDb({
          name: title,
          type: type,
          path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
        });
      });
  } else if (shortPath === "dom-elements.html") {
    $("h3").each((index, element) => {
      let title = $(element).text().trim();
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Attribute,
        num: 1,
      });

      insertToDb({
        name: title,
        type: types.Attribute,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
  } else if (shortPath === "events.html") {
    $("h3").each((index, element) => {
      let title = $(element).text().trim();
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Event,
        num: 1,
      });

      insertToDb({
        name: title,
        type: types.Event,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
  } else if (["test-utils.html", "test-renderer.html"].includes(shortPath)) {
    $("#reference")
      .nextAll("h3:has(code)")
      .each((index, element) => {
        let title = `${$(element).text().trim()} (${h1Title})`;
        addDashAnchor({
          element,
          title: element.attribs.id,
          type: types.Test,
          num: 1,
        });

        insertToDb({
          name: title,
          type: types.Test,
          path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
        });
      });
  } else {
    insertToDb({
      name: h1Title,
      type: types.Guide,
      path: relativePath,
    });
    $("h2").each((index, element) => {
      addDashAnchor({
        element,
        title: element.attribs.id,
        type: types.Section,
        num: 0,
      });

      insertToDb({
        name: `${$(element).text().trim()} - ${h1Title}`,
        type: types.Section,
        path: `${relativePath}#${encodeURIComponent(element.attribs.id)}`,
      });
    });
  }
};

const beforeFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

const filter = function ({ $, relativePath, addDashAnchor, docset }) {};

const afterFilter = function ({ $, relativePath, addDashAnchor, docset }) {};

module.exports = {
  name: "react",
  displayName: "React",
  platformFamily: "React",
  entry: "zh-hans.reactjs.org/docs/getting-started.html",
  domain: "zh-hans.reactjs.org/docs",
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

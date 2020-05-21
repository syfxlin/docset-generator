const fs = require("fs");
const path = require("path");
const exec = require("sync-exec");
const db = require("sqlite-sync");
const cheerio = require("cheerio");

module.exports = class DocSet {
  constructor(options) {
    this.docset = {
      ...options,
      ...this.getPaths(options),
      infoPlist: this.getInfoPlist(options),
    };
  }

  build() {
    this.createBaseIndex();
    this.createSqliteIndex();
    for (const docPath of this.docset.docPath) {
      this.readIndex(docPath);
      this.readDirSync(docPath);
    }
  }

  getPaths(options) {
    const basePath = path.join(
      __dirname,
      "dist",
      `${options.displayName}.docset`
    );
    const resPath = path.join(basePath, `/Contents/Resources`);
    let docPath;
    if (typeof options.domain === "string") {
      docPath = [path.join(resPath, `/Documents/${options.domain}`)];
    } else {
      docPath = options.domain.map((item) =>
        path.join(resPath, `/Documents/${item}`)
      );
    }
    return {
      basePath,
      resPath,
      docPath,
    };
  }

  getInfoPlist(options) {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
      <plist version="1.0">
        <dict>
            <key>CFBundleIdentifier</key>
              <string>${options.name}</string>
            <key>CFBundleName</key>
              <string>${options.displayName}</string>
            <key>DocSetPlatformFamily</key>
              <string>${options.platformFamily}</string>
            <key>isDashDocset</key>
              <true/>
            <key>DashDocSetFamily</key>
              <string>dashtoc3</string>
            <key>dashIndexFilePath</key>
              <string>${options.entry}</string>
        </dict>
      </plist>`;
  }

  createBaseIndex() {
    exec(`rm -rf ${this.docset.resPath}`);
    exec(`mkdir ${this.docset.resPath}`);
    exec(
      `cp ${__dirname}/icons/${this.docset.name}.png ${this.docset.basePath}/icon.png`
    );
    exec(
      `cp -r  ${__dirname}/docs/${this.docset.name}  ${this.docset.resPath}/Documents`
    );
    exec(`find ${path.join(__dirname)} -name '*.DS_Store' -type f -delete;`); // 删除当前目录下的 .DS_Store 文件

    fs.writeFileSync(
      `${this.docset.basePath}/Contents/Info.plist`,
      this.docset.infoPlist
    );
  }

  createSqliteIndex() {
    exec(`rm -rf ${this.docset.resPath}/docSet.dsidx`);

    db.connect(`${this.docset.resPath}/docSet.dsidx`);
    db.run(
      `CREATE TABLE searchIndex (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, path TEXT);`,
      undefined,
      undefined
    );
    db.run(
      `CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);`,
      undefined,
      undefined
    );
  }

  readIndex(_path) {
    if (!this.docset.indexGenerator) {
      return;
    }
    for (const indexGenerator of this.docset.indexGenerator) {
      const itemPath = path
        .join(_path, indexGenerator.file)
        .replace(/\\/g, "/");
      if (!fs.existsSync(itemPath)) {
        continue;
      }
      const relativePath = itemPath.split("Documents/")[1];
      this.generatorDocument({
        itemPath,
        relativePath,
        generator: indexGenerator,
      });
    }
  }

  readDirSync(_path) {
    let paths = fs.readdirSync(_path);
    for (const item of paths) {
      const itemPath = path.join(_path, item).replace(/\\/g, "/");
      const relativePath = itemPath.split("Documents/")[1];
      // 排除
      if (
        this.docset.exclude &&
        this.docset.exclude.find((regex) => new RegExp(regex).test(itemPath))
      ) {
        continue;
      }
      // 包含
      if (
        this.docset.include &&
        this.docset.include.length > 0 &&
        !this.docset.include.find((regex) => new RegExp(regex).test(itemPath))
      ) {
        continue;
      }
      // 目录
      if (fs.statSync(itemPath).isDirectory()) {
        this.readDirSync(itemPath);
        continue;
      }

      if (![".html", ".htm"].includes(path.extname(itemPath))) {
        continue;
      }

      for (const generator of this.docset.generator) {
        if (!new RegExp(generator.pattern).test(relativePath)) {
          continue;
        }
        this.generatorDocument({
          itemPath,
          relativePath,
          generator,
        });
      }
    }
  }

  generatorDocument({ itemPath, generator, relativePath }) {
    let html = fs.readFileSync(itemPath, {
      encoding: "utf-8",
    });
    if (generator.beforeParse) {
      html = generator.beforeParse({ path: itemPath, html: html });
    }
    let $ = cheerio.load(html);
    let params = {
      $,
      relativePath,
      addDashAnchor: this.addDashAnchor.bind({ $ }),
      docset: this.docset,
    };
    if (generator.beforeGenerateToc) {
      generator.beforeGenerateToc(params);
    }
    generator.generateToc({
      insertToDb: this.insertToDb,
      ...params,
    });
    if (generator.beforeFilter) {
      generator.beforeFilter(params);
    }
    if (generator.filter) {
      generator.filter(params);
    }
    if (generator.afterFilter) {
      generator.afterFilter(params);
    }
    html = $.html();
    if (generator.beforeWrite) {
      html = generator.beforeWrite({ path: itemPath, html: html });
    }
    this.writeFile({
      path: itemPath,
      content: html,
    });
  }

  insertToDb({ name, type, path }) {
    try {
      db.run(
        "INSERT INTO searchIndex (name, type, path) VALUES (?, ?, ?);",
        [name, type, path],
        function (res) {
          if (res.error) throw res.error;
          console.log(res);
        }
      );
    } catch (e) {
      console.log({ name, type, path });
    }
  }

  addDashAnchor({ element, title, type, num }) {
    let titleStr = `//dash_ref_${title}/${type}/${encodeURIComponent(
      title
    )}/${num}`;
    let dashAnchor = `<a class="dashAnchor" name="${titleStr}"/>`;
    this.$(element).before(dashAnchor).html();
    if (this.$(`#title`).length === 0) {
      this.$(element).attr("id", encodeURIComponent(title));
    }
  }

  writeFile({ path, content }) {
    fs.writeFileSync(path, content, "utf-8");
    console.info("文件已经成功生成.");
  }
};

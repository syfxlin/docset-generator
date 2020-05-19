const DocSet = require("./DocSet");
const config = require("./config/" + process.argv[2]);

let docSet = new DocSet(config);
docSet.build();

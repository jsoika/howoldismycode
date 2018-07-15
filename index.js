const cmd = require("./cmd");
var pathToRepo = require("path").resolve("../skipta-flic");
var fs = require("fs");
const excludes = ["node_modules", ".git", ".DS_Store", "thirdparty"];

var traverseFileSystem = function(currentPath) {
  //   console.log(currentPath);
  var files = fs.readdirSync(currentPath);
  for (var i in files) {
    var currentFile = currentPath + "/" + files[i];
    var stats = fs.statSync(currentFile);
    if (stats.isFile() && !excludes.includes(files[i])) {
      cmd.blameFile(currentPath, files[i]);
    } else if (stats.isDirectory() && !excludes.includes(files[i])) {
      traverseFileSystem(currentFile);
    }
  }
};

cmd.setFinishCallback(finish);
traverseFileSystem(pathToRepo);

function finish() {
  // sum up
  if (cmd.items.length > 0) {
    var avg = cmd.items.reduce((a, b) => a + b) / cmd.items.length;
    avg = Math.round((avg + 0.00001) * 100) / 100;
    console.log("--------------------------------");
    console.log("Total files: ", cmd.items.length);
    console.log("Avg days: ", avg);
    console.log("--------------------------------");
  }
}

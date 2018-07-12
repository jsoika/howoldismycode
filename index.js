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
      console.log(currentFile);
      cmd.blameFile(currentPath, files[i]);
    } else if (stats.isDirectory() && !excludes.includes(files[i])) {
      traverseFileSystem(currentFile);
    }
  }
};

traverseFileSystem(pathToRepo);

var pathArg = undefined;
var includeFilesArg = undefined;
var ig = undefined;
var codeageignoreFilename = ".codeageignore";
var supportedExtensions = [];

process.argv.forEach(function(val, index, array) {
  console.log(index + ": " + val);
  pathArg = array[2];
  includeFilesArg = array[3];
});

const ignore = require("ignore");
const cmd = require("./cmd");
var pathToRepo = require("path").resolve(pathArg);
var fs = require("fs");
var path = require("path");

function traverseFileSystem(currentPath) {
  //   console.log(currentPath);
  var files = fs.readdirSync(currentPath);
  for (var i in files) {
    var currentFile = currentPath + "/" + files[i];
    // add current path to filter array
    var stats = fs.statSync(currentFile);
    if (stats.isFile() && !ig.ignores(files[i]) && filterFile(files[i])) {
      cmd.blameFile(currentPath, files[i]);
    } else if (stats.isDirectory() && !ig.ignores(files[i])) {
      traverseFileSystem(currentFile);
    }
  }
}

function initFileSettings(file) {
  // read ignore file from project dir

  if (fs.existsSync(file)) {
    ig = ignore().add(fs.readFileSync(file).toString());
  }
  // fill accepted file extensions array
  if (includeFilesArg !== undefined) {
    supportedExtensions = includeFilesArg.split(",");
  } else {
  }
}

function filterFile(file) {
  if (supportedExtensions.length > 0) {
    return supportedExtensions.includes(path.extname(file));
  } else {
    return true;
  }
}

cmd.setFinishCallback(finish);
initFileSettings(codeageignoreFilename);
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

var pathArg = undefined;
process.argv.forEach(function(val, index, array) {
  console.log(index + ": " + val);
  pathArg = array[2];
});

const ignore = require("ignore");
const cmd = require("./cmd");
var pathToRepo = require("path").resolve(pathArg);
var fs = require("fs");
var ig = undefined;

function traverseFileSystem(currentPath) {
  //   console.log(currentPath);
  var files = fs.readdirSync(currentPath);
  for (var i in files) {
    var currentFile = currentPath + "/" + files[i];
    // add current path to filter array
    var stats = fs.statSync(currentFile);
    if (stats.isFile() && !ig.ignores(files[i])) {
      cmd.blameFile(currentPath, files[i]);
    } else if (stats.isDirectory() && !ig.ignores(files[i])) {
      traverseFileSystem(currentFile);
    }
  }
}

function initIgnores() {
  // ignore().add([".abc/*", "!.abc/d/"]);
  // read ignore file from project dir
  var filename = ".codeageignore";
  if (fs.existsSync(filename)) {
    ig = ignore().add(fs.readFileSync(filename).toString());
  }
  // create filter array
}

cmd.setFinishCallback(finish);
initIgnores();
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

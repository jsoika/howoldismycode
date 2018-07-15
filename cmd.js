const { exec } = require("child_process");
const { spawn } = require("child_process");

var now = Math.floor(Date.now() / 1000);
var items = [];
var done = false;
var task = [];
var finishCallback = undefined;
// function blameFile(directory, file) {
//   console.log(directory);
//   exec(
//     "pwd",
//     {
//       cwd: directory
//     },
//     function(error, stdout, stderr) {
//       // work with result
//       exec(
//         `git blame -t --date=unix --line-porcelain ${file}`,
//         (error, stdout, stderr) => {
//           if (error) {
//             console.error(`exec error: ${error}`);
//             return;
//           }
//           lines = stdout.split("\n");
//           const timestamps = lines.filter(line =>
//             line.includes("committer-time")
//           );
//           const times = timestamps.map(x => {
//             return parseInt(x.split(" ")[1]);
//           });
//           var avg = times.reduce((a, b) => a + b) / times.length;
//           var days = getTimeDiffInDays(avg, now);
//           console.log("days: " + days);
//           //   console.log(`stdout: ${stdout}`);
//           //   console.log(`stderr: ${stderr}`);
//         }
//       );
//     }
//   );
// }

function blameFileSpawn(dir, file) {
  task.push({});
  var child = spawn(
    "git",
    ["blame", "-t", "--date=unix", "--line-porcelain", file],
    { cwd: dir }
  );
  var result = "";
  child.stdout.on("data", function(data) {
    result += data.toString();
    // console.log("stdout: " + data);
  });

  child.stderr.on("data", function(data) {
    console.log("stderr: " + data);
  });

  child.on("close", function(code) {
    lines = result.split("\n");
    const timestamps = lines.filter(line => line.includes("committer-time"));
    const times = timestamps.map(x => {
      return parseInt(x.split(" ")[1]);
    });
    if (times.length > 0) {
      var avg = times.reduce((a, b) => a + b) / times.length;
      //var days = getTimeDiffInDays(avg, now);
      var timeDiff = Math.abs(now - avg);

      var days = timeDiff / 60 / 60 / 24;
      days = Math.round((days + 0.00001) * 100) / 100;
      items.push(days);
      console.log(file + " " + days + " days");
      // console.log("ndays: ", Math.ceil((now - avg) / (1000 * 3600)));
      // console.log("days: ", now - Math.floor(avg));
    }
    task.pop();
    if (task.length === 0) {
      finishCallback();
    }
  });
}

function setFinishCallback(callback) {
  finishCallback = callback;
}

function getTimeDiffInDays(timestamp, now) {
  var date1 = new Date(timestamp);
  var date2 = new Date(now);
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
}

module.exports = {
  blameFile: blameFileSpawn,
  items: items,
  done: done,
  setFinishCallback: setFinishCallback
};

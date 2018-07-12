const { exec } = require("child_process");

var now = Math.floor(Date.now() / 1000);
exec(
  "git blame -t --date=unix --line-porcelain package.json",
  (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    lines = stdout.split("\n");
    const timestamps = lines.filter(line => line.includes("committer-time"));
    const times = timestamps.map(x => {
      return parseInt(x.split(" ")[1]);
    });
    var avg = times.reduce((a, b) => a + b) / times.length;
    var days = getTimeDiffInDays(avg, now);
    console.log("days: " + days);
    //   console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);
  }
);

function getTimeDiffInDays(timestamp, now) {
  var date1 = new Date(timestamp);
  var date2 = new Date(now);
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
}

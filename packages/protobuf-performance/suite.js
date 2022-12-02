import benchmark from "benchmark";
import chalk from "chalk";

const padSize = 23;

export function newSuite(name) {
  const benches = [];
  return new benchmark.Suite(name)
    .on("add", function (event) {
      benches.push(event.target);
    })
    .on("start", function () {
      process.stdout.write(
        chalk.white.bold("benchmarking " + name + " performance ...") + "\n\n"
      );
    })
    .on("cycle", function (event) {
      process.stdout.write(String(event.target) + "\n");
    })
    .on("complete", function () {
      if (benches.length > 1) {
        benches.sort(function (a, b) {
          return getHz(b) - getHz(a);
        });
        const fastest = benches[0],
          fastestHz = getHz(fastest);
        process.stdout.write(
          "\n" +
            chalk.white(pad(fastest.name, padSize)) +
            " was " +
            chalk.green("fastest") +
            "\n"
        );
        benches.slice(1).forEach(function (bench) {
          const hz = getHz(bench);
          const percent = 1 - hz / fastestHz;
          process.stdout.write(
            chalk.white(pad(bench.name, padSize)) +
              " was " +
              chalk.red(
                (percent * 100).toFixed(1) +
                  "% ops/sec slower (factor " +
                  (fastestHz / hz).toFixed(1) +
                  ")"
              ) +
              "\n"
          );
        });
      }
      process.stdout.write("\n");
    });
}

function getHz(bench) {
  return 1 / (bench.stats.mean + bench.stats.moe);
}

function pad(str, len, l) {
  while (str.length < len) str = l ? str + " " : " " + str;
  return str;
}

const fs = require("fs");
const path = require("path");
const cosmiconfig = require("cosmiconfig");
const { pass, fail } = require("create-jest-runner");
const Nightwatch = require("nightwatch/lib/index.js");
const { CliRunner } = Nightwatch;
// const TestCase = require('nightwatch/lib/runner/testcase');
const TestSuite = require("nightwatch/lib/runner/testsuite");
const Runner = require("nightwatch/lib/runner/run");

const cosmiconfigExplorer = cosmiconfig("jest-nightwatch-runner", {
  cliOptions: {}
});

module.exports = ({ testPath, config, globalConfig }) => {
  const start = Date.now();
  return cosmiconfigExplorer
    .load()
    .then(runnerConfig => {
      console.log("runnerConfig", runnerConfig);

      return new Promise((resolve, reject) => {
        console.log("runner", testPath, config, globalConfig);

        Nightwatch.cli(function(argv) {
          const cliRunner = CliRunner({
            ...{
              _: [],
              config: "./nightwatch.json",
              c: "./nightwatch.json",
              output: "tests_output",
              o: "tests_output",
              reporter: "junit",
              r: "junit",
              env: "default",
              e: "default",
              filter: "",
              f: "",
              tag: "",
              a: "",
              _source: []
            },
            ...runnerConfig.config.cliOptions
          });

          console.log("runner instance", cliRunner);

          cliRunner.setup({}, () => {
            console.log("setup done");
          });

          console.log("this succeeds");

          const runner = new Runner(
            testPath,
            cliRunner.test_settings,
            {
              output_folder: cliRunner.output_folder,
              src_folders: cliRunner.settings.src_folders,
              live_output: cliRunner.settings.live_output,
              detailed_output: cliRunner.settings.detailed_output,
              start_session: cliRunner.startSession,
              reporter: cliRunner.argv.reporter,
              testcase: cliRunner.argv.testcase,
              end_session_on_fail: cliRunner.endSessionOnFail,
              retries: cliRunner.argv.retries,
              test_worker: cliRunner.isTestWorker(),
              suite_retries: cliRunner.argv.suiteRetries
            },
            function runnerDoneCb() {
              console.log("runnerDoneCB");
            }
          );

          console.log("runner is ready with all the settings", runner);

          //fullPaths are created in lib/runner/run:readPaths,
          //let's mimic similar behavior for a single file
          //by simply taking the directory name
          const fullPaths = [path.dirname(testPath)];

          //start selenium
          //init test suite
          //run hooks

          //so runner walks over all the files in directory
          //and executres lib/runner/run:runTestModule for each file.

          //runTestModule will create new TestSuite
          // Because jest provides us with a file name, we can instanciate new TestSuite
          // without creating Runner.

          console.log("now going to initiate TestSuite");
          //testSuite fails to be initiated, because at this step nightwatch
          //inherits default values for page objects dire and other stuff, and fails to load
          //anything from there

          //so at this moment, we are not using nightwatch.conf.json and because of
          //that we are inheriting some configuration

          //how to fix it? we need a way to pass config to nightwatch

          //i'm going to try using cosmiconfig
          //to allow specifying seetings for jest-runner-nightwatch

          const testSuite = new TestSuite(
            testPath,
            fullPaths,
            runner.options,
            runner.additionalOpts
          );

          console.log("testsuite initiated", testSuite);

          testSuite
            .on("testcase:finished", () => {
              console.log("testcase:finished");
            })
            .run()
            .then(() => {
              console.log("testSuite resolved");
              const end = Date.now();
              resolve(pass({ start, end, test: { path: testPath } }));
            })
            .catch(e => {
              console.log("error when running test", e);
              reject(fail({}));
            });

          // runner.startSelenium(function() {
          //     console.log('selenium started')
          //     const end = +new Date();

          // })
        });
      });
    })
    .catch(e => {
      console.log("jest runner failed to execute nightwatch");
      console.log(e);
      fail({});
    });
};

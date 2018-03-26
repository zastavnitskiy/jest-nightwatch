const fs = require("fs");
const path = require("path");
const cosmiconfig = require("cosmiconfig");
const winston = require("winston");
const { pass, fail } = require("create-jest-runner");
const Nightwatch = require("nightwatch/lib/index.js");
const { CliRunner } = Nightwatch;
// const TestCase = require('nightwatch/lib/runner/testcase');
const TestSuite = require("nightwatch/lib/runner/testsuite");
const Runner = require("nightwatch/lib/runner/run");

const cosmiconfigExplorer = cosmiconfig("jest-nightwatch-runner", {
  cliOptions: {}
});

function nightwatchResultsToTestResult({ testPath, start, nightwatchResults }) {
  console.log(JSON.stringify(nightwatchResults, null, 2));
  const { passed, failed, errors, skipped, timestamp, testcases } = nightwatchResults;
  const testResult = {
    console: null,
    failureMessage: "errorMessage",
    numFailingTests: failed,
    numPassingTests: passed,
    numPendingTests: 0,
    perfStats: {
      end: Date.now(),
      start
    },
    skipped: false,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      unmatched: 0,
      updated: 0
    },
    sourceMaps: {},
    testExecError: null,
    testFilePath: testPath,
    testResults: [
      {
        ancestorTitles: [],
        duration: 1000,
        failureMessages: ["test.errorMessage"],
        fullName: "test.testPath",
        numPassingAsserts: 1,
        status: "failed",
        title: JSON.stringify(testcases, null)
      }
    ]
  };

  return testResult;
}

module.exports = ({ testPath, config, globalConfig }) => {
  const start = Date.now();
  return cosmiconfigExplorer
    .load()
    .then(runnerConfig => {
      return new Promise((resolve, reject) => {
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

          cliRunner.setup({}, function setupDone() {});

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
            function runnerDoneCb() {}
          );

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
          const testSuideReportKey = testSuite.getReportKey();

          const logger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
              //
              // - Write to all logs with level `info` and below to `combined.log`
              // - Write all logs error (and below) to `error.log`.
              //
              new winston.transports.File({
                filename: `${testSuideReportKey}.log`
              })
            ]
          });

          testSuite
            .on("testcase:finished", (results, errors, time) => {
              logger.info("testcase:finished");
              logger.info(results);
              logger.info("testcase:finished-end");
            })
            .run()
            .then(testResults => {
              const end = Date.now();
              logger.info("resolve");
              logger.info(testResults);
              logger.info("resolve-end");

              logger.info({
                start,
                end: Date.now(),
                test: { path: testPath }
              });

              resolve(
                nightwatchResultsToTestResult({
                  nightwatchResults: testResults,
                  testPath,
                  start
                })
              );
            })
            .catch(e => {
              //todo improve with proper error and remove console.log
              console.error(e);
              resolve(
                fail({
                  start,
                  end: Date.now(),
                  test: {
                    path: testPath,
                    errorMessage: e.message,
                    title: e.message
                  }
                })
              );
            });
        });
      });
    })
    .catch(e => {
      console.log(e);
      throw e;
    });
};

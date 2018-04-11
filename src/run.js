const fs = require("fs");
const path = require("path");
const cosmiconfig = require("cosmiconfig");
const { pass, fail } = require("create-jest-runner");
const Nightwatch = require("nightwatch/lib/index.js");
const { CliRunner } = Nightwatch;
const TestSuite = require("nightwatch/lib/runner/testsuite");
const Runner = require("nightwatch/lib/runner/run");
// const winston = require("winston");
// winston.add(winston.transports.File, { filename: "/tmp/runjs.log" });
// winston.remove(winston.transports.Console);

const cosmiconfigExplorer = cosmiconfig("jest-runner-nightwatch", {
  cliOptions: {}
});

function errorToTestResult(error, extra = {}) {
  const errorMessage = error.message || "Unknown error";
  const failureMessage = `\nThere was an error while starting the test runner:\n\n${errorMessage}\n\n${
    error.stack
  }\n`;

  const { testFilePath = "Unknown test" } = extra;

  return {
    failureMessage,
    console: null,
    numFailingTests: 1,
    numPassingTests: 0,
    numPendingTests: 0,
    perfStats: {
      end: Date.now(),
      start: Date.now()
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
    testExecError: error,
    testFilePath,
    testResults: [
      {
        ancestorTitles: [],
        duration: 0,
        failureMessages: ["fullMsg"],
        fullName: `fullname: `,
        location: null,
        numPassingAsserts: 0,
        status: "skipped",
        title: `title`
      }
    ]
  };
}

module.exports = async function({ testPath, config, globalConfig }) {
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
          const suiteName = testSuite.getReportKey();

          const aggregatedResults = {
            passed: 0,
            failed: 0,
            tests: [],
            suiteName
          };

          testSuite
            .on("testcase:finished", (results, errors, time) => {
              const { passed, failed, tests } = results;
              const testsWithName = tests.map(test => ({
                ...test,
                testName: testSuite.currentTest
              }));
              aggregatedResults.passed += passed;
              aggregatedResults.failed += failed;
              aggregatedResults.tests = aggregatedResults.tests.concat(
                testsWithName
              );
            })
            .run()
            .then(resolvedResults => {
              const { suiteName, tests, passed, failed } = aggregatedResults;

              const clientResults = testSuite.client.results();
              const clientErrors = testSuite.client.errors();
              const testSuiteIsDisabled = testSuite.module.isDisabled();
              const {currentTest} = testSuite;
              /**
               * Depending on test failure type,
               * errors may happen and be delivered here differently.
               *
               * In some cases, we need to use the resolve output,
               * sometimes we read errors from testcase:finished event,
               * sometimes we have to read errors from the client.
               *
               * This has to be fixed in nightwatch itself, but we should
               * also be reado to handle those cases.
               */
              // winston.info("clientResults", clientResults);
              // winston.info("clientErrors", clientErrors);
              // winston.info("resolveResults", resolvedResults);
              // winston.info("aggregatedResults", aggregatedResults);

              const { steps = [] } = resolvedResults;

              if (clientErrors && clientErrors.length) {
                resolve({
                  failureMessage: clientErrors.join('\n').concat('\n'),
                  console: null,
                  numFailingTests: 1,
                  numPassingTests: 0,
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
                  testFilePath: suiteName,
                  testResults: clientErrors.map(error => {
                    return {
                      ancestorTitles: [currentTest],
                      duration: Date.now() - start,
                      failureMessages: [error],
                      fullName: `fullname`,
                      location: null,
                      numPassingAsserts: 0,
                      status: 'failed',
                      title: `Test execution error`
                    };
                  })
                });
                return null;
              }

              const skippedTests = steps.map(testName => ({
                ancestorTitles: [testName],
                duration: Date.now() - start,
                failureMessages: null,
                fullName: `fullname: ${suiteName} - ${testName}`,
                location: null,
                numPassingAsserts: 0,
                status: "skipped",
                title: `${"title-message"}`
              }));

              const testResults = tests.map(
                ({ testName, failure, fullMsg, stackTrace, message }) => {
                  return {
                    ancestorTitles: [testName],
                    duration: Date.now() - start,
                    failureMessages: [fullMsg],
                    fullName: `fullname: ${suiteName} - ${testName}`,
                    location: null,
                    numPassingAsserts: 0,
                    status: Boolean(failure) ? "failed" : "passed",
                    title: `${message}`
                  };
                }
              );

              const failureMessage = tests
                .filter(({ failure }) => failure)
                .map(({ testName, failure, message, fullMsg, stackTrace }) => {
                  return `${fullMsg || message}\n${failure}\n${stackTrace}\n\n`;
                })
                .join("\n");

              resolve({
                failureMessage: failureMessage || null,
                console: null,
                numFailingTests: failed,
                numPassingTests: passed,
                numPendingTests: 0,
                perfStats: {
                  end: Date.now(),
                  start
                },
                skipped: testSuiteIsDisabled,
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
                testFilePath: suiteName,
                testResults: testSuiteIsDisabled ? skippedTests : testResults
              });
            })
            .catch(error => {
              // nightwatch then is a deferred, so if the error is not consumed, nothing happens
              // we need to catch it and throw or reject the runner promise.
              const testResult = {
                ...errorToTestResult(error, { testFilePath: suiteName }),
                testFilePath: suiteName
              };
              resolve(testResult);
            });
        });
      });
    })
    .catch(error => {
      return errorToTestResult(error, { testFilePath: testPath });
    });
};

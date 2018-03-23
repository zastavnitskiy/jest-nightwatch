const fs = require('fs');
const { pass, fail } = require('create-jest-runner');
const Nightwatch = require('nightwatch/lib/index.js');
const {CliRunner} = Nightwatch;
// const TestCase = require('nightwatch/lib/runner/testcase');

module.exports = ({ testPath, config, globalConfig}) => {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        console.log('runner',  testPath, config, globalConfig);

        Nightwatch.cli(function(argv) {
            argv._source = argv['_'].slice(0);
            debugger;
            const runner = CliRunner(argv);
            console.log('runner instance', runner);
            runner.setup({}, () => {
                console.log('setup done')
            });
            
            const {settings} = runner;

            console.log('runner is set up, runner has settings', settings)

            //start selenium
            //init test suite
            //run hooks

            //now I need something like this
            
            // var runner = new Runner(source, this.test_settings, {
            //     output_folder : this.output_folder,
            //     src_folders : this.settings.src_folders,
            //     live_output : this.settings.live_output,
            //     detailed_output : this.settings.detailed_output,
            //     start_session: this.startSession,
            //     reporter : this.argv.reporter,
            //     testcase : this.argv.testcase,
            //     end_session_on_fail : this.endSessionOnFail,
            //     retries : this.argv.retries,
            //     test_worker : this.isTestWorker(),
            //     suite_retries : this.argv.suiteRetries
            //   }, fn);
            //   return runner.run();


            runner.startSelenium(function() {
                console.log('selenium started')
                const end = +new Date();

                resolve(pass({ start, end, test: { path: testPath } }))
            })
        })
        
        
        
    
        
    }).catch(e => {
        console.log('jest runner failed to execute nightwatch')
        return fail(e);
    })
};
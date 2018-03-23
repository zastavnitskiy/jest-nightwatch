const fs = require('fs');
const { pass, fail } = require('create-jest-runner');

module.exports = ({ testPath, config, globalConfig}) => {
    console.log('runner',  testPath, config, globalConfig);
    const start = +new Date();
    const contents = fs.readFileSync(testPath, 'utf8');
    const end = +new Date();

    return pass({ start, end, test: { path: testPath } })
};
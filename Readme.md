# jest-runner-nightwatch [![Build Status](https://travis-ci.org/zastavnitskiy/jest-nightwatch.svg?branch=master)](https://travis-ci.org/zastavnitskiy/jest-nightwatch)

Run your nightwatch tests using jest as a runner. 

# Usage
Add `jest` configuration and move command line parameters that you used for nightwatch into `jest-runner-nightwatch` configuration in your `package.json` or config files.

So, if use were runnig nightwatch like this `$ nightwatch --env default -c ./nightwatch.conf.js`, the config will be:
```json
{
 "jest": {
    "runner": "jest-runner-nightwatch"
 }, 
 "jest-runner-nightwatch": {
    "cliOptions": {
      "config": "./nightwatch.conf.js",
      "env": "default"
    }
  }
}
```
The project uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), so you can also put settings 
into .config.js or .rc file.

Now, instead of running `nightwatch`, you can run `jest`.


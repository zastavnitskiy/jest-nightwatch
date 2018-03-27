# jest-runner-nightwatch

Run your nightwatch tests using jest as a runner. This is an early beta, feedback is appreciated.

# Usage
First, you will need to move nightwatch commandline options to a config file – 
because we won't be running nightwatch from commandline anymore.

This `$ nightwatch --env default -c ./nightwatch.conf.js` should be changed into
```json
{
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

Next, we need to tell test to use `jest-runner-nightwatch` – to do that, we will also use package.json:

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
Now, instead of running `nightwatch`, you can run `jest`;


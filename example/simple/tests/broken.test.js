const someutil = require('random-name');

module.exports = {
    "first-test": browser => {
      browser.waitForElementVisible("body", 3000);
      browser.end();
    },
  
    "second-test": (browser, done) => {
      browser.waitForElementVisible(".content", 3000);
      browser.end();
    }
  };
  
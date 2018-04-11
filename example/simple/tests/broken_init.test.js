throw new Error('Error when initializing test');

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
  
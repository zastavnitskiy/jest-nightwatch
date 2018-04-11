
module.exports = {
    "first-test": browser => {
      throw new Error('Error when asserting test');

      browser.waitForElementVisible("body", 3000);
      browser.end();
    },
  
    "second-test": (browser, done) => {
      browser.waitForElementVisible(".content", 3000);
      browser.end();
    }
  };
  
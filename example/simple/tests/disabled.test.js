module.exports = {
    beforeEach: browser => {
      browser.url("https://google.com");
    },
  
    after: browser => browser.end(),
    "@disabled": true,
    "disabled-first-test": browser => {
      browser.waitForElementVisible("body", 3000);
      browser.end();
    },
  
    "disabled-second-test": (browser, done) => {
      browser.waitForElementVisible(".content", 3000);
      browser.end();
    }
  };
  
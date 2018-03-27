module.exports = {
  beforeEach: browser => {
    browser.url("https://google.com");
  },

  after: browser => browser.end(),

  "first-test": browser => {
    browser.waitForElementVisible("body", 3000);
    browser.end();
  },

  "second-test": (browser, done) => {
    browser.waitForElementVisible(".content", 3000);
    browser.end();
  }
};

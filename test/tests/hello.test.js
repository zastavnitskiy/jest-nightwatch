module.exports = {
  beforeEach: browser => {
    browser.url("https://google.com");
  },

  afterEach: (browser, done) => {
    browser.end();
    done()
  },

  "first-test": browser => {
    browser.waitForElementVisible("body", 3000);
  },

  "second-test": browser => {
    browser.expect.element("form").to.be.present;
    browser.expect.element("form").to.be.visible;
  }
};

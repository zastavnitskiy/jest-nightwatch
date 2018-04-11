
module.exports = {
    "before": browser => {
      
      browser
        .url('http://google.com')
        .waitForElementPresent('body', 3000);
      throw new Error('Error in test lifecycle');
    },

    "first-test": browser => {
      browser.waitForElementVisible("body", 3000);
      browser.end();
    },
  
    "second-test": (browser, done) => {
      browser.waitForElementVisible(".content", 3000);
      browser.end();
    }
  };
  
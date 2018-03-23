module.exports = {
  "test-name": browser => {
    browser
      .url('http://google.com')
      .waitForElementVisible('#hplogo', 3000)
      .end();
  }
}
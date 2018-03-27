module.exports = {
    "test-failure": browser => {
      browser
        .url('https://google.com')
        .waitForElementVisible('#blah', 3000)
        .end();
    }
  }

  
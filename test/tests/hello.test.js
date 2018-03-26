module.exports = {
  "test-google": browser => {
    browser
      .url('https://google.com')
      .waitForElementVisible('#hplogo', 3000)
      .setValue('.gsfi', 'jest-nightwatch')
      .submitForm("form.tsf")
      .waitForElementVisible('body')
      .assert.visible('body')
      .assert.visible('div')
      .end();
  },
  "test-bookings": browser => {
    browser
      .url('https://booking.com.com');
    browser.expect('form'),to.be.present;
    browser.expect('form'),to.be.visible;
    
    browser.submitForm("form");
    browser.end();
  }
}
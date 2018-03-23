module.exports = {
  "test-google": browser => {
    browser
      .url('https://google.com')
      .waitForElementVisible('#hplogo', 3000)
      .setValue('.gsfi', 'jest-nightwatch')
      .submitForm("form.tsf")
      .end();
  },
  "test-bookings": browser => {
    browser
      .url('https://booking.com.com')
      .waitForElementVisible('form', 3000)
      .submitForm("form")
      .end();
  }
}
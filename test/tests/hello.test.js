module.exports = {
  "test-google": browser => {
    browser
      .url('https://google.com')
      .waitForElementVisible('body', 3000)
      .end();
  },
  
  "test-bookings": browser => {
    browser
      .url('https://booking.com.com');
    browser.expect.element('form').to.be.present;
    browser.expect.element('form').to.be.visible;
    browser.end();
  }
}
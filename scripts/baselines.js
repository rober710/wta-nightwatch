/**
 * Uses PhantomJs to take the baseline screenshots of the WTA site.
 */

var path = require('path');

module.exports = {
    before: browser => {
        let screenWidth = browser.options.desiredCapabilities.screenWidth;
        console.log('Resizing window to ' + screenWidth + ' x 800...');
        browser.resizeWindow(screenWidth, 800);
    },

    'Taking baseline of Home': browser => {
        console.log('Taking baseline images of home from site: ' + browser.launchUrl);
        browser.url(browser.launchUrl)
            .waitForElementVisible('#superfish-1', 5000, 'Waiting for menu to be visible.')
            .waitForElementVisible('div[class="content livescore-container livescore-widget"]', 2000,
                'Waiting for livescores to be visible.')
            .waitForJqueryAjaxRequest(1000)
            .saveScreenshot(path.join(__dirname, '..', 'screenshots', 'baseline', 'home.png'));
    },

    after: browser => {
        browser.end();
    }
};

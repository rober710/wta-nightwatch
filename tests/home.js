/**
 * Script to test the home page.
 */

module.exports = {
    before: browser => {
        console.log('Testing home page...');
        browser.url(browser.launchUrl);
    },

    Livescores : browser => {
        browser.waitForElementVisible('div[class="content livescore-container livescore-widget"]', 2000);
        browser.waitForJqueryAjaxRequest(1000);
        browser.waitForElementPresent('div[class="livescoredetails players"]', 500);
        browser.waitForElementPresent('div[class="set set1"]', 500);
        browser.waitForJqueryAjaxRequest(1000);
        browser.getAttribute('div.livescoredetails.players div.player-name a', 'title', function (res) {
            this.assert.equal(typeof res, "object");
            this.assert.equal(res.status, 0);
            this.assert.notEqual(res.value, null);
            this.assert.notEqual(res.value, undefined);
            this.assert.equal(res.value.trim() === '', false);
        });
        browser.elements('css selector', 'div.data.livescore-item.group', function (response) {
            this.assert.equal(response.status, 0);
            this.assert.equal(response.value.length > 1, true);
        });
    },

    after: browser => {
        console.log('End tests for home page. Closing browser...');
        browser.end();
    }
};

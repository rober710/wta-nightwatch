/**
 * Script to test the home page.
 */

var path = require('path');
var resemble = require('resemble');

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
            this.assert.equal(typeof res, "object", "Response is an object.");
            this.assert.equal(res.status, 0, "Response status is 0 (success).");
            this.assert.notEqual(res.value, null, "Attribute's value is not null.");
            this.assert.notEqual(res.value, undefined, "Attribute's value is not undefined.");
            this.assert.equal(res.value.trim() === '', false, "Attribute's value is not empty. Ajax completed successfully.");
        });
        browser.elements('css selector', 'div.data.livescore-item.group', function (response) {
            this.assert.equal(response.status, 0, "Response status is 0 (success).");
            this.assert.equal(response.value.length > 1, true, "Livescores rendered.");
        });
        //browser.saveScreenshot(path.join(__dirname, 'pantallazo-prod.png'));
        resemble.resemble(path.join(__dirname, 'pantallazo-prod.png')).compareTo(path.join(__dirname, 'pantallazo.png'))
            .ignoreAntialiasing().onComplete(function () {
            console.log(arguments);
        });
    },

    after: browser => {
        console.log('End tests for home page. Closing browser...');
        browser.end();
    }
};

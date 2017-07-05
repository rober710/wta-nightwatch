/**
 * A visual regression test of the site.
 */

var fs = require('fs');
var path = require('path');
var resemble = require('resemble').resemble;

let baselinePath = path.join(__dirname, '..', 'screenshots', 'baseline');
let testsPath = path.join(__dirname, '..', 'screenshots', 'tests');
let diffPath = path.join(__dirname, '..', 'screenshots', 'diffs');

let comparisonCallback = function (imgName, comparisonResult) {
    let diffBuffer = new Buffer(comparisonResult.getImageDataUrl()
        .replace(/data:image\/png;base64,/, ''), 'base64');
    fs.writeFileSync(path.join(diffPath, imgName), diffBuffer);
    console.log('Dimension difference: ' + JSON.stringify(comparisonResult.dimensionDifference));
    console.log('% difference: ' + comparisonResult.misMatchPercentage);
};

module.exports = {

    before: browser => {
        let screenWidth = browser.options.desiredCapabilities.screenWidth;
        console.log('Resizing window to ' + screenWidth + ' x 800...');
        browser.resizeWindow(screenWidth, 800);
        console.log('Taking screenshots from: ' + browser.launchUrl);
    },

    'Taking screenshot of Home': browser => {
        browser.url(browser.launchUrl)
            .waitForElementVisible('#superfish-1', 5000, 'Waiting for menu to be visible.')
            .waitForElementVisible('div[class="content livescore-container livescore-widget"]', 2000,
                'Waiting for livescores to be visible.')
            .waitForJqueryAjaxRequest(1000)
            .saveScreenshot(path.join(testsPath, 'home.png'), function (saveResult) {
                browser.assert.equal(saveResult.state, 'success', 'Save home screenshot success.');
                let baselineFile = path.join(baselinePath, 'home.png');
                let testFile = path.join(testsPath, 'home.png');
                console.log('Comparing ' + baselineFile + ' with ' + testFile);

                resemble.outputSettings({errorType: 'flat', transparency: 1})(baselineFile).compareTo(testFile)
                    .onComplete(comparisonCallback.bind(this, "home.png"));
            });
    },

    after: browser => {
        browser.end();
    }
};

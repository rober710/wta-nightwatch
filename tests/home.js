/**
 * Script to test the home page.
 */

var path = require('path');

module.exports = {
    before: browser => {
        let screenWidth = browser.options.desiredCapabilities.screenWidth;
        console.log('Resizing window to ' + screenWidth + ' x 800...');
        browser.resizeWindow(screenWidth, 800);
        console.log('Testing home page...');
        browser.url(browser.launchUrl);
    },

    Menu: browser => {
        console.log('Checking menu items...');
        let menuItems = new Set(['players', 'tournaments', 'scores', 'stats', 'rankings', 'news',
            'photos', 'videos', 'health', 'shop', 'en español',
            // Players submenu items:
            'head to head', 'player index',
            // Tournament submenu items:
            'active and upcoming', 'calendar', 'wta finals', 'where to watch'
        ]);

        browser.waitForElementVisible('#superfish-1', 5000);

        // Make submenu visible for this test so we can retrieve their texts.
        browser.execute(function () {
            var submenu = $('#rm-no-id-2, #rm-no-id-3');
            submenu.removeClass('sf-hidden');
            submenu.css('display', 'block');
        });

        // Here we check all levels at once. If you want to check only first level, change selector to
        // #superfish-1 li.sf-depth-1 > a
        let menuSelector = '#superfish-1 li a';
        let playersMenuId = null;
        let tournamentsMenuId = null;

        browser.perform(function (done) {
            console.log('Calling menu items');
            browser.elements('css selector', menuSelector, function (menuItemsResult) {
                this.assert.equal(menuItemsResult.status, 0, 'Menu items retrieved.');
                this.assert.equal(menuItemsResult.value.length > 0, true, 'Checking menu items count > 0.');
                if (!menuItemsResult.value.length) {
                    done();
                }
                let processedItems = 0;
                for (let i = 0; i < menuItemsResult.value.length; i++) {
                    let element = menuItemsResult.value[i];
                    browser.elementIdText(element.ELEMENT, function (resultText) {
                        if (resultText.status === 0) {
                            let menuItemText = resultText.value.toLowerCase().replace(' »', '');
                            console.log('Checking menu item ' + menuItemText);
                            menuItems.delete(menuItemText);

                            if (menuItemText === 'players') {
                                playersMenuId = element.ELEMENT;
                            } else if (menuItemText === 'tournaments') {
                                tournamentsMenuId = element.ELEMENT;
                            }
                        }

                        if (++processedItems === menuItemsResult.value.length) {
                            done();
                        }
                    });
                }
            });
        }).perform(function (client, done) {
            // Check all required menu items have been found.
            client.assert.equal(menuItems.size, 0, 'All required menu items found.');
            // Hide the submenu.
            client.execute(function () {
                var submenu = $('#rm-no-id-2, #rm-no-id-3');
                submenu.addClass('sf-hidden');
            });
            done();
        }).perform(function (client, done) {
            if (playersMenuId !== null) {
                client.moveTo(playersMenuId, null, null, result => {
                    if (result.status === 0) {
                        client.waitForElementVisible('#rm-no-id-2', 1500, 'Players submenu displayed when mouse '
                            + 'over it.');
                        done();
                    } else {
                        console.log(result);
                        throw new Error('Could not move mouse to players submenu.');
                    }
                });
            } else {
                throw new Error('Players menu not found!');
            }
        }).perform(function (client, done) {
            if (tournamentsMenuId !== null) {
                client.moveTo(tournamentsMenuId, null, null, result => {
                    if (result.status === 0) {
                        client.waitForElementVisible('#rm-no-id-3', 1500, 'Tournaments submenu displayed when mouse '
                            + 'over it.');
                        done();
                    } else {
                        console.log(result);
                        throw new Error('Could not move mouse to tournaments submenu.');
                    }
                });
            } else {
                throw new Error('Tournaments submenu not found!');
            }
        });
    },

    Livescores : !(browser => {
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
            this.assert.equal(res.value.trim() === '', false,
                "Attribute's value is not empty. Ajax completed successfully.");
        });
        browser.elements('css selector', 'div.data.livescore-item.group', function (response) {
            this.assert.equal(response.status, 0, "Response status is 0 (success).");
            this.assert.equal(response.value.length > 1, true, "Livescores rendered.");
        });
    }),

    'Main Highlight Image': browser => {
        let highlightImageSelector = 'div.node--article.news.node--highlight-news.node--article--highlight-news'
            + '[typeof="sioc:Item foaf:Document"] ';
        highlightImageSelector += 'div[class="field__item even"][rel="og:image rdfs:seeAlso"][resource] a picture';
        // Check the pictures are created
        browser.waitForElementVisible(highlightImageSelector, 500, 'Picture elements found.');
        browser.waitForElementVisible(highlightImageSelector + ' img[src]', 500, 'Image inside picture found.');
    },

    'Latest news': browser => {
        let latestNewsHeaderSelector = 'div.news.block-news-row.block--articles--row h3';
        browser.waitForElementVisible(latestNewsHeaderSelector, 500);
        browser.getText(latestNewsHeaderSelector, function (res) {
            this.assert.equal(res.value, 'Latest News', 'Latest news header found.');
        });

        browser.elements('css selector', 'div.news.block-news-row.block--articles--row', function (response) {
            // Find the element that contains the Latest News header.
            this.assert.equal(response.status, 0, "Response status is 0 (success).");
            for (let i = 0; i < response.value.length; i++) {
                let element = response.value[i];
                browser.elementIdElements(element.ELEMENT, 'css selector', 'h3, div.node--article--teaser-views'
                    + '[typeof="sioc:Item foaf:Document"] picture img', function (response) {
                    this.assert.equal(response.status, 0, "Response status is 0 (success).");
                    let h3 = response.value[0];
                    browser.elementIdText(h3.ELEMENT, function (textResult) {
                        this.assert.equal(textResult.status, 0, "Response status is 0 (success).");
                        if (textResult.value === 'Latest News') {
                            // This is the block of latest news. Check there are three more nodes after this one,
                            // ensuring there are at least three photos.
                            this.assert.equal(response.value.length > 3, true,
                                'Latest news block has at least 3 images.');
                        }
                    });
                });
            }
        });
    },

    'Latest Videos': browser => {
        let latestVideosSelector = 'div.videos.block-media-row.block--articles--row';
        browser.waitForElementVisible(latestVideosSelector, 500);
        let latestVideosFoundWithImages = false;
        browser.perform(function (done) {
            browser.elements('css selector', latestVideosSelector, function (response) {
                this.assert.equal(response.status, 0, 'Video blocks retrieved.');
                this.assert.equal(response.value.length > 0, true, 'At least one video block found.');
                let elementsProcessed = 0;
                for (let i = 0; i < response.value.length; i++) {
                    let element = response.value[i];
                    browser.elementIdElements(element.ELEMENT, 'css selector', 'h3, div.slick-slide picture img',
                        function (childsResponse) {
                            this.assert.equal(childsResponse.status, 0, 'Childs of video block retrieved.');
                            let title = childsResponse.value[0];
                            this.elementIdText(title.ELEMENT, function (textResult) {
                                this.assert.equal(textResult.status, 0, "Retrieved title text...");
                                if (textResult.value === 'Latest Videos' && childsResponse.value.length > 3) {
                                    latestVideosFoundWithImages = true;
                                }
                            });

                            if (++elementsProcessed === response.value.length) {
                                done();
                            }
                        });
                }
            });
        }).perform(function (client, done) {
            client.assert.equal(latestVideosFoundWithImages, true, 'Latest videos found and has images.');
            done();
        });
    },

    'Rankings': browser => {
        // Check if the rankings block exists
        browser.waitForElementVisible('#block-luxbox-ranking-luxbox-ranking-tiles-highlight', 500,
            'Rankings block found.');
        browser.getLocationInView('#block-luxbox-ranking-luxbox-ranking-tiles-highlight', function (result) {
            this.assert.equal(result.status, 0, 'Scrolling to show blocks.');
        }).elements('css selector', '#block-luxbox-ranking-luxbox-ranking-tiles-highlight .ranking-wrapper',
            function (result) {
                this.assert.equal(result.status, 0, 'Ranking tiles found.');
                this.assert.equal(result.value.length, 2, 'Checking there are two ranking tiles.');
                // Check both have singles and doubles tabs.
                let wtaRankings = result.value[0].ELEMENT;
                let prtsRankings = result.value[1].ELEMENT;
                this.elementIdElements(wtaRankings, 'css selector', '.singles-container, .doubles-container',
                    function (tabsResult) {
                    this.assert.equal(tabsResult.status, 0, 'Searching for tabs on WTA Rankings block.');
                    this.assert.equal(tabsResult.value.length, 2, 'Found singles and doubles tabs.');
                    // Check there are other slides.
                    this.elementIdElements(tabsResult.value[0].ELEMENT, 'css selector', '.slick-slide',
                        function (slidesResult) {
                        this.assert.equal(slidesResult.status, 0, 'Searching for singles ranking slides.');
                        this.assert.equal(slidesResult.value.length > 1, true,
                            'There is more than one singles ranking slide: ' + slidesResult.value.length);
                    }).elementIdElements(tabsResult.value[1].ELEMENT, 'css selector', '.slick-slide',
                        function (slidesResult) {
                        this.assert.equal(slidesResult.status, 0, 'Searching for doubles ranking slides.');
                        this.assert.equal(slidesResult.value.length > 1, true,
                            'There is more than one doubles ranking slide: ' + slidesResult.value.length);
                    });
                }).elementIdElements(prtsRankings, 'css selector', '.roadsingles-container, .roaddoubles-container',
                    function (tabsResult) {
                    this.assert.equal(tabsResult.status, 0, 'Searching for tabs on Porsche Road block.');
                    this.assert.equal(tabsResult.value.length, 2, 'Found singles and doubles tabs.');
                    this.elementIdElements(tabsResult.value[0].ELEMENT, 'css selector', '.slick-slide',
                        function (slidesResult) {
                            this.assert.equal(slidesResult.status, 0, 'Searching for PRTS singles ranking slides.');
                            this.assert.equal(slidesResult.value.length > 1, true,
                                'There is more than one singles ranking slide: ' + slidesResult.value.length);
                        }).elementIdElements(tabsResult.value[1].ELEMENT, 'css selector', '.slick-slide',
                        function (slidesResult) {
                            this.assert.equal(slidesResult.status, 0, 'Searching for PRTS doubles ranking slides.');
                            this.assert.equal(slidesResult.value.length > 1, true,
                                'There is more than one doubles ranking slide: ' + slidesResult.value.length);
                        });
                });
        });
    },

    'Partners Block': browser => {
        browser.getLocationInView('#block-luxbox-layouts-luxbox-partners-block', function (result) {
            this.assert.equal(result.status, 0, 'Scrolling to partners block.');
        }).elements('css selector', '#block-luxbox-layouts-luxbox-partners-block h3.block__title', function (result) {
            this.assert.equal(result.status, 0, 'Searching for partners block title.');
            this.assert.equal(result.value.length, 1, 'Block title found.');
            this.elementIdText(result.value[0].ELEMENT, function (textResult) {
                this.assert.equal(textResult.status, 0, 'Retrieving text of the block title.');
                this.assert.equal(textResult.value.toLowerCase(), 'global partners', 'Checking block title text.');
            });
        }).elements('css selector', '#block-luxbox-layouts-luxbox-partners-block a img', function (imgResult) {
            this.assert.equal(imgResult.status, 0, 'Searching for partners logos.');
            this.assert.equal(imgResult.value.length > 0, true, 'There is at least one partner logo: '
                + imgResult.value.length);
        });
    },

    after: browser => {
        console.log('End tests for home page. Closing browser...');
        browser.end();
    }
};

/**
 * Nightwatch configuration for local tests.
 */

const windowWidth = 1280;

let nightwatchConfig = {
    "src_folders": [ "tests" ],
    "output_folder": "reports",
    "custom_commands_path": "node_modules/nightwatch-custom-commands-assertions/js/commands",
    "custom_assertions_path": "node_modules/nightwatch-custom-commands-assertions/js/assertions",
    "page_objects_path": "",
    "selenium": {
        "start_process": true,
        "server_path": "./bin/selenium.jar",
        "log_path": "./reports",
        "host": "127.0.0.1",
        "port": 4444,
        "cli_args": {
            "webdriver.chrome.driver": "./bin/chromedriver",
            "webdriver.gecko.driver" : "./bin/geckodriver",
            "webdriver.edge.driver" : ""
        }
    },
    "test_settings": {
        "default": {
            "launch_url": "http://wta2-staging.cloudapp.net",
            "silent": true,
            "log_screenshot_data": false,
            "desiredCapabilities": {
                "browserName": "chrome",
                "chromeOptions": {
                    "args": [
                        "disable-web-security",
                        "test-type",
                        "incognito",
                        "disable-extensions",
                        "window-size=" + windowWidth + ",800"
                    ]
                },
                "javascriptEnabled": true,
                "acceptSslCerts": true
            }
        },

        "firefox": {
            "webdriver.firefox.profile": "./firefox-profiles/nightwatch",
            "desiredCapabilities": {
                "browserName": "firefox",
                "marionette": true,
                "javascriptEnabled": true,
                "moz:firefoxOptions": {
                    "log": {
                        "level": "trace"
                    }
                }
            }
        },

        "edge": {
            "desiredCapabilities": {
                "browserName": "MicrosoftEdge"
            }
        },

        "safari": {
            "desiredCapabilities": {
                "browserName": "safari::: TODO:!"
            }
        },

        "phantomjs": {
            "desiredCapabilities": {
                "browserName": "phantomjs",
                "javascriptEnabled" : true,
                "acceptSslCerts" : true,
                "phantomjs.cli.args" : []
            },
            "screenshots": {
                "enabled": true,
                "path": "./screenshots/tests"
            }
        },

        "phantomjs:baseline": {
            "launch_url": "http://wtatennis.com",
            "desiredCapabilities": {
                "browserName": "phantomjs",
                "javascriptEnabled" : true,
                "acceptSslCerts" : true,
                "phantomjs.cli.args" : []
            },
            "screenshots": {
                "enabled": true,
                "path": "./screenshots/baseline"
            }
        }
    }
};

for (let key in nightwatchConfig.test_settings) {
    if (nightwatchConfig.test_settings.hasOwnProperty(key)) {
        let config = nightwatchConfig.test_settings[key];
        config['selenium_host'] = nightwatchConfig.selenium.host;
        config['selenium_port'] = nightwatchConfig.selenium.port;

        let capabilities = config.desiredCapabilities;
        if (capabilities === undefined) {
            config.desiredCapabilities = {};
            capabilities = config.desiredCapabilities;
        }
        capabilities.screenWidth = windowWidth;
    }
}

module.exports = nightwatchConfig;

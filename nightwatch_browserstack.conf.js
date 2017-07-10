/* Browserstack Nightwatch Configuration */

const BROWSERSTACK_USER = "myuser";
const BROWSERSTACK_KEY = "mykey";
const LAUNCH_URL_PREFIX = "http://wtatennis.com";

let commonCapabilities = {
    "project": "wta",
    "browserstack.user": BROWSERSTACK_USER,
    "browserstack.key": BROWSERSTACK_KEY,
    'browserstack.debug': true
};

function getScreenWidth(resolutionStr) {
    let resolutionRegex = /(\d+)x(\d+)/;
    let parts = resolutionRegex.exec(resolutionStr);

    if (parts === null) {
        throw new Error('Invalid resolution string: ' + resolutionStr);
    }

    // FIXME: Check for NaN after parse.
    return parseInt(parts[1]);
}

let nightwatchConfig = {
    "src_folders": [ "tests" ],
    "output_folder": "reports",
    "custom_commands_path": "node_modules/nightwatch-custom-commands-assertions/js/commands",
    "custom_assertions_path": "node_modules/nightwatch-custom-commands-assertions/js/assertions",
    "selenium": {
        "start_process": false,
        "log_path": "./reports",
        "host": "hub-cloud.browserstack.com",
        "port": 80
    },
    "test_settings": {
        "win7:chrome50:1280": {
            "desiredCapabilities": {
                "os": "Windows",
                "os_version": "7",
                "browser": "Chrome",
                "browser_version": "50.0",
                "resolution": "1280x800",
                "chromeOptions": {
                    "args": [
                        "disable-web-security",
                        "test-type",
                        "incognito",
                        "disable-extensions",
                        "window-size=1280,800" // TODO: Change height dynamically when taking screenshots.
                    ]
                },
            }
        },
        "win7:firefox40:1280": {
            "desiredCapabilities": {
                "os": "Windows",
                "os_version": "7",
                "browser": "Firefox",
                "browser_version": "40.0",
                "resolution": "1280x800"
            }
        },
        "win7:ie10:1280": {
            "desiredCapabilities": {
                "os": "Windows",
                "os_version": "7",
                "browser": "IE",
                "browser_version": "10.0",
                "resolution": "1280x800"
            }
        },
        "osxcaptn:safari9.1:1280": {
            "desiredCapabilities": {
                'os': 'OS X',
                'os_version': 'El Capitan',
                'browser': 'Safari',
                'browser_version': '9.1',
                'resolution': '1280x960',
                "safariOptions": {
                    "cleanSession": true
                }
            }
        }
    }
};

// Fill the configurations with common options.
for (let key in nightwatchConfig.test_settings) {
    let config = nightwatchConfig.test_settings[key];
    config['selenium_host'] = nightwatchConfig.selenium.host;
    config['selenium_port'] = nightwatchConfig.selenium.port;
    config['launch_url'] = LAUNCH_URL_PREFIX;

    config.desiredCapabilities = Object.assign({}, commonCapabilities, config.desiredCapabilities);
    if (config.desiredCapabilities.resolution) {
        config.desiredCapabilities.screenWidth = getScreenWidth(config.desiredCapabilities.resolution);
    }
}

module.exports = nightwatchConfig;

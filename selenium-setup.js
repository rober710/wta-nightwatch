/**
 * Setups selenium for easy installation on a developer's machine.
 */

const selenium = require('selenium-download');
const path = require('path');

selenium.ensure(path.join(__dirname, 'bin'), function (err) {
    if (err) {
        console.error(err.stack);
        process.exit(0);
    }
});

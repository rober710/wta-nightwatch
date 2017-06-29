# Nightwatch tests scripts for WTA site

## Requirements
For this project you need to have Java installed (preferably JDK8+) and ImageMagick.

## Setup
The project includes an installer for Selenium and Chromedriver. These commands will download the selenium server and the chrome driver binary:

```
$ npm install
$ npm run setup:chrome
```
The `tests` folder contains the source code of the tests. To run them, execute this command:

```
$ npm run test
```
The test results are written to the console. A report that can be fed into a CI system is written to the `reports` forlder.

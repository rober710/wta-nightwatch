# Nightwatch test scripts for WTA site

## Requirements
For this project you need to have Java (preferably JDK8+), ImageMagick, Cairo, and PhantomJs installed.

### Gnu/Linux users
You can use your package manager to install the required libraries. For RHEL-like systems:
```
$ dnf install giflib.x86_64 giflib-devel.x86_64 libjpeg-turbo.x86_64 libjpeg-turbo-devel.x86_64 libjpeg-turbo-utils.x86_64 cairo.x86_64 cairo-devel.x86_64 ImageMagick.x86_64
```
For PhantomJs, you can download the official precompiled binaries [here](https://bitbucket.org/ariya/phantomjs/downloads). Don't forget to add bin/phantomjs to your PATH.

### Mac users
You can use homebrew to install the dependencies:
```
$ brew install cairo
$ brew install imagemagick
$ brew install phantomjs
```

## Setup
The project includes an installer for Selenium and Chromedriver. These commands will download the selenium server and the chrome driver binary:

```
$ npm install
$ npm run setup:chrome
```

## Running the tests
The `tests` folder contains the source code of the tests. The command

```
$ npm run test
```
runs the test suite of the site against Google Chrome. You can select other browsers with the -e parameter like this:
```
$ npm run test -e firefox
```
which will run the tests against firefox. Currently, only firefox and phantomjs are supported.
Also, you can run 
```
$ npm run test:all
```
which will launch both Chrome and Firefox and run the test suite in parallel on both browsers.

The test results are written to the console. A report that can be fed into a CI system is written to the `reports` forlder.

## Visual regression tests
The visual regression tests compare a baseline image of the site to the current one and creates a new image with the differences colored in pink.

Visual regression tests rely on PhantomJS being installed and available in your PATH.

To create the baseline images, run this command:
```
$ npm run baseline-img
```
Baseline images are taken from the [production site](http://wtatennis.com) by default.

After the baseline images are created, you can run the tests which will compare the [staging site](http://wta2-staging.cloudapp.net) to the baseline images with this command:
```
$ npm run test:visual
```
To change the site from which test screenshots will be taken, add a `"lauch_url"` to the `"phantomjs"` configuration in `nightwatch.json`:
```
"phantomjs": {
    "launch_url": "http://127.0.0.1/my_local_site",
    "selenium_port": 4444,
    "selenium_host": "127.0.0.1",
    [...]
},
```

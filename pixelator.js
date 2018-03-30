#!/usr/bin/env node

'use strict';
/*
  Quick and dirty tool to convert tif images and move them to another directory,
  while mirroring the folder structure.
*/

const klaw = require('klaw');
const path = require('path');
const fs = require('fs-extra');
const _cliProgress = require('cli-progress');
const im = require('imagemagick');
const PromisePool = require('es6-promise-pool');

const CONCURRENCY = 8;

const argv = require('yargs')
    .usage('Usage: $0 [options]')
    .example('$0 -s /home/media/usb01 -p output')
    .alias('s', 'source')
    .nargs('s', 1)
    .describe('s', 'Source directory')
    .demandOption(['s'])
    .alias('p', 'prefix')
    .nargs('p', 2)
    .default('p', 'output')
    .describe('p', 'Prefix in target directory')
    .alias('f', 'format')
    .nargs('f', 3)
    .default('f', 'jpg')
    .describe('f', 'target format')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2018')
    .argv;

const toConvert = [];

klaw(argv.source)
  .on('data', item => {
    if (path.extname(item.path) === '.tif') {
      toConvert.push(item.path);
    }
  })
  .on('end', () => convertImages(toConvert));

const convertImages = (images) => {
  // create a new progress bar instance and use shades_classic theme
  const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
  // start the progress bar with a total value of 200 and start value of 0
  bar.start(images.length, 0);

  const generatePromises = function * () {
    for (let i = 0, len = images.length; i < len; i++) {
      yield generateOnePromise(images[i])
    }
  };

  const generateOnePromise = (item) => {
    return new Promise(function (resolve, reject) {
      const filename = path.parse(item).name;
      const infix = path.dirname(path.relative(argv.source,item));
      const final = path.join(argv.source, argv.prefix, infix);

      // create directory for target
      fs.ensureDirSync(final);

      const targetFile = path.join(final,filename) + '.' + argv.format;

      im.convert([item, '-format', argv.format, targetFile],
      function(err, stdout){
        bar.increment();
        if (err) {
          console.log(`Failed to convert ${item}, error was: ${err}`)
        };
        resolve();
      });
    })
  };

  const pool = new PromisePool(generatePromises(), CONCURRENCY)

  pool.start()
    .then(function () {
      // stop the progress bar
      bar.stop();
    })
}

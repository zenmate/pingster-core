#!/usr/bin/env node

const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');

const { loadConfig } = require('../src/parser');
const tester = require('../src/tester');

const optimist = require('optimist')
  // .usage('\nUsage: pingster --config ./path/to/config')
  .alias('c', 'config')
  .alias('d', 'debug')
  .alias('d', 'verbose')
  .alias('h', 'help')
  .alias('v', 'version')
  .describe('c', 'optional path to config file wtih .yml ext')
  .describe('d', 'enable verbose logging mode')
  .describe('h', 'print help')
  .describe('v', 'print version');
const argv = optimist.argv;

if (argv.help) {
  optimist.help();
  optimist.showHelp();
  return;
}

if (argv.version) {
  const version = fs.readJSONSync(path.join(__dirname, '../package.json')).version;

  console.info(version);
  return;
}

const verboseMode = argv.verbose;

const configPath = path.join(process.cwd(), argv.config || './pingster.yml');
verboseMode && console.log('configPath:', configPath);

let config;
try {
  config = loadConfig(configPath);
} catch (e) {
  console.error(`Problem opening config: ${e}`);
  return process.exit(1);
}
verboseMode && console.log('config:', JSON.stringify(config, null, 2));

const spinner = ora({ color: 'green' });
spinner.start('Running tests!');

(async () => {
  try {
    const results = await tester(config);
    verboseMode && console.log('results:', JSON.stringify(results, null, 2));

    const failed = results.filter(x => !x.success);
    if (failed.length) {
      spinner.fail(`This tests have failed: ${failed.map(x => x.name).join()}`);
    } else {
      spinner.succeed('All tests have successfully finished!');
    }
  } catch (e) {
    spinner.fail(`Something went wrong! ${e}`);
  }
})();

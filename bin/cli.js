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
  .alias('s', 'allow-snapshots')
  .describe('c', 'optional path to config file wtih .yml ext')
  .describe('d', 'enable verbose logging mode')
  .describe('h', 'print help')
  .describe('v', 'print version')
  .describe('s', 'allow snapshots creation');
const argv = optimist.argv;

if (argv.help) {
  optimist.help();
  optimist.showHelp();
  return;
}

if (argv.version) {
  const version = fs.readJSONSync(path.join(__dirname, '../package.json'))
    .version;

  console.info(version);
  return;
}

const verboseMode = argv.verbose;
const allowSnapshots = argv.s;

const configPath = path.join(process.cwd(), argv.config || './pingster.yml');
verboseMode && console.log('configPath:', configPath);

let config;
try {
  config = loadConfig(configPath);
} catch (e) {
  console.error(`Problem opening config: ${e}`);
  return process.exit(1);
}

const spinner = ora({ color: 'green' });
spinner.start('Running tests!');

if (allowSnapshots) {
  const names = Object.keys(config);
  names.forEach(name => {
    try {
      config[name].snapshot = fs.readJSONSync(
        `${path.join(process.cwd(), '.pingster', 's', name)}`
      );
    } catch (e) {
      // 🤔 well it looks like there is no snapshot
    }
  });
}

verboseMode && console.log('config:', JSON.stringify(config, null, 2));

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

    if (allowSnapshots) {
      const successful = results.filter(x => x.success);
      successful.forEach(x =>
        fs.outputJson(
          `${path.join(process.cwd(), '.pingster', 's', x.name)}`,
          x
        )
      );
    }
  } catch (e) {
    spinner.fail(`Something went wrong! ${e}`);
  }
})();

const tester = require('./src/tester');
const parser = require('./src/parser');

module.exports = {
  tester,
  ...parser
};

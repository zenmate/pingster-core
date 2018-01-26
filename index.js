const tester = require('./tester');
const parser = require('./parser');

module.exports = {
  tester,
  ...parser
};

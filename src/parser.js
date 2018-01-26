const YAML = require('yamljs');

exports.loadConfig = function loadConfig(path) {
  return YAML.load(path);
};

exports.parseConfig = function parseConfig(str) {
  return YAML.parse(str);
};

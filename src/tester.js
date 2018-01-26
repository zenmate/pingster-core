const axios = require('axios');
const ismatch = require('lodash.ismatch');
const { mapLimit } = require('async');

const instance = axios.create({
  headers: { 'User-Agent': 'pingster' }
});

async function runTest(test) {
  try {
    const { status, data, headers } = await instance.get(test.url);
    let success = true; // if there is no expects and request succeeded - all good ^_^

    if (test.expect.status) {
      success = success && status === test.expect.status;
    }

    if (test.expect.data) {
      success = success && ismatch(data, test.expect.data);
    }

    if (test.expect.headers) {
      success = success && ismatch(headers, test.expect.headers);
    }

    return { success, response: { status, data, headers }, ...test };
  } catch (e) {
    return { success: false, error: e, ...test };
  }
}

module.exports = function tester(config = {}) {
  return new Promise((resolve, reject) => {
    const testNames = Object.keys(config);

    // make an array so it's easier to work with
    const tests = testNames.map(name => ({ name, ...config[name] }));

    mapLimit(tests, 4, runTest, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

# Pingster

> Never let your APIs down! Pingster is the tool that allows you test any API requests that are used inside your apps and projects. 

## Install

```bash
npm install pingster
```

## Usage

### CLI

In the root of your project create `pingster.yml` file that looks like:

```yaml
httpbin:
  url: https://httpbin.org/get?hello=world
  expect:
    status: 200
```

Then run Pingser command inside your folder:

```bash
pingster
```

and it will test if that url returns `200` as you expect!

#### Options

```bash
Options:
  -c, --config            optional path to config file wtih .yml ext
  -d, --debug, --verbose  enable verbose logging mode
  -h, --help              print help
  -v, --version           print version
```

### Programmatic

It is also possible to use Pingster inside your code directly:

```js
const pingster = require('pingster');

const config = {
  httpbin: {
    url: 'https://httpbin.org/get?hello=world'
    expect: {
      status: 200
    }
  }
};

pingster.tester(config).then(testResults => {
  console.log(testResults);
});
```

#### API

- `loadConfig(path: String) -> Object` - load and parse YAML config file from specified path and get a config object in return
- `parseConfig(yaml: String) -> Object` - parse YAML string and get a config object in return
- `tester(config: Object) -> Promise` - run tests on APIs specified in config object, returns a Promise

### Config structure

```yaml
# api name
httpbin: 
  # api url that will be tested
  url: https://httpbin.org/get?hello=world
  # data that will be tested to match with response
  expect:
    status: 200
    data:
      foo: bar
      num: 123
      bool: true
      obj:
        key: value
    headers:
      content-type: application/json
```

## Pingster as a Service

---


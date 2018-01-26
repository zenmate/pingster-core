Pingster
========

> Never let your APIs down

## Usage

### CLI

Install `pingster` globally:

```sh
npm install -g pingster
```

In the root of your project create a file `pingster.yml` that looks like:

```yml
httpbin:
  url: https://httpbin.org/get?hello=world
```

Then run

```sh
pingster
```

and it will test that url works!

#### cli options

```
Options:
  -c, --config            optional path to config file wtih .yml ext
  -d, --debug, --verbose  enable verbose logging mode
  -h, --help              print help
  -v, --version           print version
```


### Programatic

Install `pingster` as a dependency:

```sh
npm install pingster
```

And use it like this:

```js
const pingster = require('./index');

// const config = pingster.parseConfig(ymlString);
// const config = pingster.loadConfig(configPath);

const config = {
  httpbin: {
    url: 'https://httpbin.org/get?hello=world'
  }
}

pingster.tester(config).then(testResults => {
  console.log(testResults);
});

```

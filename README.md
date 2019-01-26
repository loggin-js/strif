


<!-- Links -->
[npm-image]: https://img.shields.io/npm/v/strif.svg?style=flat-square
[npm-url]: https://npmjs.org/package/strif

[code-quality-badge]: http://npm.packagequality.com/shield/strif.svg?style=flat-square
[code-quality-link]: https://packagequality.com/#?package=strif

[downloads-badge]: https://img.shields.io/npm/dm/strif.svg?style=flat-square
[downloads-link]: https://www.npmjs.com/package/strif

[dependencies-badge]: https://img.shields.io/david/nombrekeff/strif.svg?style=flat-square
[dependencies-link]: https://david-dm.org/nombrekeff/strif?view=tree

[vulnerabilities-badge]: https://snyk.io/test/npm/strif/badge.svg?style=flat-square
[vulnerabilities-link]: https://snyk.io/test/npm/strif

# :card_index: strif <!-- omit in toc -->

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-badge]][downloads-link]
[![](https://img.shields.io/bundlephobia/min/strif.svg?style=flat-square)]()  
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]
[![NPM quality][code-quality-badge]][code-quality-link]

Format strings easily 

## Features <!-- omit in toc -->
* ✔︎ Simple
* ✔︎ Expandable/Configurable
* ✔︎ Type Checking
* ✔︎ No Dependencies


## Overview
```js
const formatter = strif.create({
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString()
  },
  plugins: [
    '.tests/plugins/strif-color.js'
  ]
});

const template =
  formatter
    .template('{time} {user} {message}')
    .prop('time', { transformers: [`date`, `lds`, `blue`] })
    .prop('user', { accessor: 'user.name', transformers: [`gray`] })
    .prop('message', { type: 'string' });

console.log(template.compile(data));
// will output: <%b1970-1-1 04:07:03> <%grBob> This is a super long message
```

## Table Of Content <!-- omit in toc -->
- [Overview](#overview)
- [Installation](#installation)
- [Importing](#importing)
- [Usage](#usage)
- [Api](#api)
  - [strif](#strif)
    - [strif.Formatter](#strifformatter)
    - [strif.Template](#striftemplate)
    - [strif.Prop](#strifprop)
    - [strif.PropOptions](#strifpropoptions)
    - [strif.TemplateOptions](#striftemplateoptions)
    - [strif.FormatterOptions](#strifformatteroptions)
- [Found a bug or have a feature request](#found-a-bug-or-have-a-feature-request)
- [Contributing](#contributing)

## Installation
Install from npm:
```
$ npm install strif
```

## Importing
```js
const strif = require('strif');
import strif from 'strif';
```

## Usage
Using **strif** is actually pretty easy, you can use the default formatter under **strif**
```js
let template = strif.template('{time} {user} {message}');
template.compile(data);
```
or create a custom one by using `strif.create(opts)`, you can pass a set of transformers and other [options]()
```js
const formatter = strif.create({
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString()
  }
});

let template = formatter
  .template('{time} {user} {message}')
  .prop('time', { transformers: [`date`] });

template.compile(data);
```


## Api
### strif
Exported members from `strif`.
```ts
interface strif {
  create(opts: strif.StrifOptions): void;
  Formatter: strif.Formatter;
}
```

#### strif.Formatter
```ts
interface strif.Formatter {
  constructor(opts: strif.FormatterOptions);
  template(template: string, options: strif.TemplateOptions): strif.Template;
  fromFile(path: string, options: strif.TemplateOptions): strif.Template;
}
```

#### strif.Template
```ts
interface strif.Template {
  constructor(template: string, transformers: { [key: string]: (v) => v }, options: strif.TemplateOptions);
  prop(name: string, options: strif.PropOptions): this;
  print(): void;
  compile(data: object): string;
}
```

#### strif.Prop
```ts
interface strif.Prop {
  constructor(name, opts: strif.PropOptions);
  getFromObject(obj: object): any;
}
```

#### strif.PropOptions
```ts
interface strif.PropOptions {
  accessor: string;
  type: string;
  transformers: string[];
}
```

#### strif.TemplateOptions
```ts
interface strif.TemplateOptions {
  props: strif.StrifProp[];
}
```

#### strif.FormatterOptions
```ts
interface strif.FormatterOptions {
  transformers: { [key: string]: (v) => v };
  plugins: string[]; 
}
```

## Found a bug or have a feature request
If you found a **bug** or have a **feature request** please dont hesitate on leaving a [issue]()

## Contributing
If you would like to collaborate please check [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

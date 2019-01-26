# strif  <!-- omit in toc -->
Format strings easily 

## Features <!-- omit in toc -->
* ✔︎ Simple
* ✔︎ Expandable/Configurable
* ✔︎ Type Checking
* ✔︎ No Dependencies


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

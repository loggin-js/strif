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
- [Documentation](#documentation)
  - [strif](#strif)
    - [strif.Strif](#strifstrif)
    - [strif.StrifTemplate](#strifstriftemplate)
    - [strif.StrifProp](#strifstrifprop)
  - [PropOptions](#propoptions)
  - [TemplateOptions](#templateoptions)
  - [StrifOptions](#strifoptions)
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


## Documentation

### strif
```ts
interface strif {
  create(opts: StrifOptions): void;
  Strif: Strif;
}
```

#### strif.Strif
```ts
interface Strif {
  constructor(opts: StrifOptions);
  template(template: string, options: TemplateOptions): StrifTemplate;
  fromFile(path: string, options: TemplateOptions): StrifTemplate;
}
```

#### strif.StrifTemplate
```ts
interface StrifTemplate {
  constructor(template: string, transformers: { [key: string]: (v) => v }, options: TemplateOptions);
  prop(name: string, options: PropOptions): this;
  print(): void;
  compile(data: object): string;
}
```

#### strif.StrifProp
```ts
interface StrifProp {
  constructor(name, opts: PropOptions);
  getFromObject(obj: object): any;
}
```

### PropOptions
```ts
interface PropOptions {
  accessor: string;
  type: string;
  transformers: string[];
}
```

### TemplateOptions
```ts
interface TemplateOptions {
  props: StrifProp[];
}
```

### StrifOptions
```ts
interface StrifOptions {
  // Set of transformer functions
  transformers: { [key: string]: (v) => v };

  // Plugins path
  plugins: string[]; 
}
```

## Found a bug or have a feature request
If you found a **bug** or have a **feature request** please dont hesitate on leaving a [issue]()

## Contributing
If you would like to collaborate please check [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

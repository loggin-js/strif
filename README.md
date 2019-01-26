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
- [Documentation](#documentation)
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


## Documentation
Check out the [wiki](./wiki) for a more information.

## Found a bug or have a feature request
If you found a **bug** or have a **feature request** please dont hesitate on leaving a [issue]()

## Contributing
If you would like to collaborate please check [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

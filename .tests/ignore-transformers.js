const strif = require('..');
const formatter = strif.create({
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString()
  },
  plugins: [
    './.tests/plugins/strif-color.js'
  ]
});

const template =
  formatter
  .template('{time} {user} {message}')
  .prop('time', {
    transformers: [`date`, `lds`, `blue`]
  })
  .prop('user', {
    accessor: 'user.name',
    transformers: [`gray`]
  })
  .prop('message');

let data = {
  time: Date.now(),
  message: 'This is a super long message ',
  user: {
    name: 'Bob'
  }
};

console.log(template.compile(data, {
  ignoreTransformers: ['gray']
}));
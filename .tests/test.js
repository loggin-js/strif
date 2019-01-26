
// Second idea
const strif2 = require('../src/strif');
let data = {
  time: 11223322,
  message: 'This is a super long message ',
  user: { name: 'Bob' }
}

const formatter2 = strif2.create({
  transformers: {
    date: s => new Date(s),
    lds: d => d.toLocaleString()
  },
  plugins: [
    './.tests/plugins/strif-color.js'
  ]
});

const template =
  formatter2
    .template('{time} {user} {message}')
    .prop('time', { transformers: [`date`, `lds`, `blue`] })
    .prop('user', { accessor: 'user.name', transformers: [`gray`] })
    .prop('message');

console.log(template.compile(data));

const template2 =
  formatter2
    .fromFile('./.tests/template.ejs')
    .prop('name');

template2.print();
console.log(template2.compile({ name: 'myFunction' }));

const template3 =
  formatter2
    .template('{time} {user} {message}',
      {
        props: {
          time: { transformers: [`date`, `lds`, `blue`] },
          user: { accessor: 'user.name', transformers: [`gray`] },
          message: {}
        }
      }
    );
console.log(template3.compile(data));

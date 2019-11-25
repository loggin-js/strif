const strif = require('../strif');
let result = strif.compile('Hi {name}!', {
    name: 'John'
});

console.log('result', result);
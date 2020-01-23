const strif = require('../strif');

strif.template();

let formatter = strif.create({
    transformers: {
        date: s => new Date(s),
        lds: d => d.toLocaleDateString(),
        upper: d => d.toUpperCase(),
    }
});

let template = formatter.template(`Hi {name}!`, {
    props: {
        name: {},
    }
});

let result = template.compile({
    name: 'John'
});
console.log('result', result);

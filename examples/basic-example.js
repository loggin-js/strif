const strif = require('../strif');

let formatter = strif.create({
    transformers: {
        date: s => new Date(s),
        lds: d => d.toLocaleDateString(),
        upper: d => d.toUpperCase(),
    }
});

let template = formatter.template(`{date} - {message}`, {
    props: {
        date: { transformers: [`date`, `lds`] },
        message: { transformers: [`upper`] }
    }
});

let result = template.compile({ date: '10-10-2019', message: 'Hey there!' });
console.log('result', result);
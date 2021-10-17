const strif = require('../strif');

const formatter = strif.create({
    transformers: {
        date: s => new Date(s),
        lds: d => d.toLocaleString()
    }
});

const template =
    formatter
        .template('[{time}] {user} - {message}', {
            props: {
                time: { transformers: [`date`, `lds`] },
                user: { transformers: [], accessor: 'user.name' },
            }
        })
        .prop('message', { type: 'string' });

const data = {
    time: Date.now(),
    user: { name: 'Manolo' },
    message: 'This is the message',
};
console.log();
console.log(template.compile(data));
console.log();
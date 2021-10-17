const strif = require('../strif');

const template = strif
    .template('[{time}] {user} - {message}', {
        props: {
            // `time` will be treated as a date, and apply the "lds" (toLocaleString) transformer
            time: { transformers: [`date`, `lds`] },

            // `user` does not use any transformers, but it specifies the dot notation path to the data ('user.name')
            user: { transformers: [(c) => c.toUpperCase()], accessor: 'user.name' },
        }
    })
    // props can be defined after creating the template, and can also define a type
    .prop('message', { type: 'string' });

// If we want to apply data to the template, we do it by using the `compile()` method
const logMessage = template.compile({
    time: Date.now(),
    user: { name: 'Manolo' },
    message: 'This is the message',
});

console.log();
console.log(logMessage);
console.log();
const { Suite } = require('benchmark');
const strif = require('../../strif');

var suite = new Suite;

function getLink(data) {
    return `https://github.com/${data.owner}/${data.repo}`;
}

const data = {
    owner: 'loggin-js',
    repo: 'strif',
};
const linkTemplate = strif.template('https://github.com/{owner}/{repo}');



const cases = [
    {
        name: "getLink",
        generate: () => getLink(data)
    },
    {
        name: "linkTemplate",
        generate: () => linkTemplate.compile(data)
    },
]


cases.forEach(testCase => {
    suite.add(testCase.name, testCase.generate);
});

// add tests
const results = [];
suite
    .on("cycle", event => {
        const { name, hz } = event.target;
        const { generate, ...testCase } = cases.find(
            lib => lib.name === name
        );

        results.push({
            name,
            "ops/sec": Math.round(hz),
            ...testCase
        });
    })
    .on("complete", () => {
        console.table(results);
    })
    .run();
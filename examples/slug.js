const strif = require('../strif');

const githubRepoLink = 
  strif
    .template('https://github.com/{owner}/{repo}')
    .compile({ owner: 'loggin-js', repo: 'strif' });

console.log();
console.log(githubRepoLink);
console.log();
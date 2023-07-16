const util = require('util');
const exec = util.promisify(require('child_process').exec);

main();

async function main() {
  await exec('git archive HEAD -o source.zip');
}
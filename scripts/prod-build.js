const fs = require('fs/promises');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

main();

async function main() {
  await fs.rm('./extension/dist', { recursive: true, force: true });
  await fs.mkdir('./extension/dist', { recursive: true });
  await exec('npm run build -- --prod');
  console.log('Done');
}

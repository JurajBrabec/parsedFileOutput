const { PassThrough } = require('stream');
const child_process = jest.createMockFromModule('child_process');

let stdout = new PassThrough();
let stderr = new PassThrough();
let data = ['data'];
let onSpawn;
let onError;

function on(event, callback) {
  if (event === 'error') onError = callback;
  if (event === 'spawn') onSpawn = callback;
}
function execFile(file, args, options) {
  onError = null;
  onSpawn = null;
  stdout = new PassThrough();
  stderr = new PassThrough();
  setTimeout(() => {
    onSpawn();
    data.map((d) => stdout.write(d));
    stdout.end();
  }, 100);
  return {
    stdout,
    stderr,
    on,
  };
}
function setData(newData) {
  data = newData;
}

child_process.execFile = jest.fn(execFile);
child_process.__setData = setData;

module.exports = child_process;

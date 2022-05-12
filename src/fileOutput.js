const { execFile } = require('child_process');
const { PassThrough } = require('stream');

module.exports = ({ file, args = [], options = {} }) => {
  const stream = (moreArgs = []) =>
    new Promise((resolve, reject) => {
      const opts = { encoding: 'utf8', maxBuffer: Infinity };
      const output = new PassThrough();
      const proc = execFile(file, [...args, ...moreArgs], {
        ...opts,
        ...options,
      });
      proc.on('close', (code) => {
        if (output.closed) return;
        const msg = options.timeout
          ? `Error -1 (Terminated after ${options.timeout}ms)`
          : `Error ${code}`;
        output.end(msg);
      });
      proc.on('error', reject);
      proc.on('spawn', () => {
        proc.stdout.pipe(output);
        proc.stderr.pipe(output);
        resolve(output);
        //        resolve(proc.stdout.wrap(proc.stderr));
      });
    });
  const asString = async (chunks) => {
    let result = '';
    for await (const chunk of chunks) result += chunk;
    return result;
  };

  return (args = []) => {
    this.asStream = () => stream(args);
    this.asString = () => stream(args).then(asString);
    return this;
  };
};

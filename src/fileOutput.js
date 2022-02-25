const { execFile } = require('child_process');
const { PassThrough } = require('stream');

module.exports = ({
  file,
  args = [],
  options = { encoding: 'utf8', maxBuffer: Infinity },
}) => {
  const stream = (moreArgs = []) =>
    new Promise((resolve, reject) => {
      const proc = execFile(file, [...args, ...moreArgs], options);
      proc.on('error', reject);
      proc.on('spawn', () => {
        const output = new PassThrough();
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

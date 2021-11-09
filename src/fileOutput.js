const { execFile } = require('child_process');

module.exports = ({ file, args = [], options = {} }) => {
  const stream = (moreArgs = []) =>
    new Promise((resolve, reject) => {
      const proc = execFile(file, [...args, ...moreArgs], options);
      proc.on('error', reject);
      proc.on('spawn', () => {
        proc.stderr.pipe(proc.stdout);
        resolve(proc.stdout);
      });
    });

  const asString = async (chunks) => {
    let result = '';
    for await (const chunk of chunks) result += chunk;
    return result;
  };

  return (args) => {
    this.asStream = () => stream(args);
    this.asString = () => stream(args).then(asString);
    return this;
  };
};

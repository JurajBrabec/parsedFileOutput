const FileOutput = require('./fileOutput');

module.exports = ({
  file,
  args = [],
  options = { encoding: 'utf8', maxBuffer: Infinity },
  delimiter = /\r?\n/,
}) => {
  const stream = FileOutput({ file, args, options });
  const split = async function* (stream) {
    let remainder = '';
    for await (const chunk of stream) {
      const splits = (remainder + chunk).split(delimiter);
      remainder = splits.pop();
      for (const split of splits) yield split.trim();
    }
    if (remainder !== '') yield remainder.trim();
  };

  return (args) => {
    this.asSplits = () => stream(args).asStream().then(split);
    return this;
  };
};

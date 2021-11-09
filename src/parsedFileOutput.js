const SplitFileOutput = require('./splitFileOutput');

module.exports = ({
  file,
  args = [],
  delimiter = /\r?\n/,
  options,
  parser,
}) => {
  const split = SplitFileOutput({ file, args, options, delimiter });
  const forEach = async function* (splits, fn) {
    for await (const split of splits) {
      const result = fn ? fn(split) : split;
      if (result) yield result;
    }
  };
  const parse = (splits) => forEach(splits, parser);
  const asArray = async (items) => {
    const result = [];
    for await (const item of items) result.push(item);
    return result;
  };
  return (args) => {
    this.asLoop = () => split(args).asSplits().then(parse);
    this.asArray = () => split(args).asSplits().then(parse).then(asArray);
    return this;
  };
};

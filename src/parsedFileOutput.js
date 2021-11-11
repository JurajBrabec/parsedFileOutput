const SplitFileOutput = require('./splitFileOutput');

module.exports = ({
  file,
  args = [],
  delimiter = /\r?\n/,
  options,
  parser = (s) => s,
}) => {
  const split = SplitFileOutput({ file, args, options, delimiter });
  const parse = async function* (splits) {
    for await (const split of splits) {
      const item = parser(split);
      if (item) yield item;
    }
  };
  const asArray = async (items) => {
    const result = [];
    for await (const item of items)
      Array.isArray(item) ? result.push(...item) : result.push(item);
    return result;
  };

  return (args = []) => {
    this.asItems = () => split(args).asSplits().then(parse);
    this.asArray = () => split(args).asSplits().then(parse).then(asArray);
    return this;
  };
};

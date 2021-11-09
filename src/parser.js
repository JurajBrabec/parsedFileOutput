module.exports = ({
  separator = ',',
  quote = '"',
  fields,
  split,
  assign,
  cast,
}) => {
  const _split = (text) => {
    const q = quote;
    const s = separator instanceof RegExp ? separator.source : separator;
    const pattern = new RegExp(`(?<!${q}.{0,255})${s}|${s}(?!.*${q}.*)`);
    return text.split(pattern).map((s) => s.trim());
  };
  const _assign = (values) =>
    Object.entries(fields).reduce((row, [name, field], index) => {
      if (typeof field === 'string') field = { type: field };
      if (field.index !== undefined) index = field.index;
      let value = values[index];
      if (field.regExp) {
        const match = value.match(field.regExp);
        value = match ? match[1] : undefined;
      }
      row[name] = cast ? cast(value, field) : value;
      return row;
    }, {});

  return (text) => {
    if (!text) return false;
    const values = split ? split(text, _split) : _split(text);
    if (!values) return false;
    const handler = (values) =>
      assign ? assign(values, _assign) : _assign(values);
    return Array.isArray(values[0]) ? values.map(handler) : handler(values);
  };
};

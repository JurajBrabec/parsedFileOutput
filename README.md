# `ParsedFileOutput` package

- [FileOutput](#file-output)
- [SplitFileOutput](#split-file-output)
- [ParsedFileOutput](#parsed-file-output)
- [Parser](#parser)

<a name="file-output"></a>

## `FileOutput` function

Returns the output (`stdout`) of an executable command as an iterable stream or as a string.

### Usage/Examples

import the package

```javascript
const { FileOutput } = require('fileOutput');
```

instantiate a process with no arguments

```javascript
const stdout = FileOutput({ file: '/path/to/file' });
```

or instantiate a process with arguments

```javascript
const stdout = FileOutput({ file: '/path/to/file', args: ['arg1', 'arg2'] });
```

get the entire output as string

```javascript
console.log(await stdout().asString());
```

or read the output as an iterable stream

```javascript
for await (const chunk of stdout().asStream()) {
  console.log(chunk);
}
```

it is also possible to pass additional arguments to the process in the call

```javascript
console.log(await stdout(['arg3']).asString());
```

<a name="split-file-output"></a>

## `SplitFileOutput` function

Returns the output (`stdout`) of an executable command split by a `delimiter` as an iterable stream.

### Usage/Examples

import the package

```javascript
const { SplitFileOutput } = require('splitFileOutput');
```

instantiate a process similar to [`FileOutput`](#file-output), but with a `string` or `RegExp` delimiter (defaults to `/\r?\n/` if none specified)

```javascript
const stdout = SplitFileOutput({ file: '/path/to/file', delimiter: '\n' });
```

or

```javascript
const stdout = SplitFileOutput({ file: '/path/to/file', delimiter: /\n/ });
```

read output split to items as an iterable stream

```javascript
for await (const split of stdout().asSplits()) {
  console.log(split);
}
```

<a name="parsed-file-output"></a>

## `ParsedFileOutput` function

Returns the output (`stdout`) of an executable command split by a `delimiter` and applied a `parser` function to each as an iterable stream.

### Usage/Examples

import the package

```javascript
const { ParsedFileOutput } = require('parsedFileOutput');
```

instantiate a process similar to [`SplitFileOutput`](#split-file-output), but with a `parser` function. Basically it is a function, that converts `text` input (the split) to anything you want, i.e. an object.

```javascript
const parser = (text) => ({ data: text, length: text.length });
```

For more complex examples of the parser function, see [section below](#parser).

```javascript
const stdout = ParsedFileOutput({
  file: '/path/to/file',
  delimiter: '\n',
  parser,
});
```

read parsed output split to items as an iterable stream

```javascript
for await (const item of stdout().asItems()) {
  console.log(item);
}
```

or read parsed output split to items as an array

```javascript
const items = stdout().asArray();
console.log(items);
```

<a name="parser"></a>

## `Parser` function

Returns a function, that converts a text to object with predefined fields.

### Usage/Examples

import the package

```javascript
const { Parser } = require('parsedFileOutput');
```

Instantiate the function with `fields` definition.

```javascript
const parser = Parser({ fields });
```

You can specify a `separator` (either `string` or `RegExp`, defaults to `,` if none specified) and/or a `quote` character (defaults to `"`).

```javascript
const parser = Parser({ fields, separator: ';', quote: '`' });
```

You can specify one or more of three functions:

- [`split`](#splt)
- [`assign`](#assign)
- [`cast`](#cast)

<a name="split"></a>

### The `split` function

This function has two arguments, the `text` input and a default `separate` function (i.e. converts `delimiter` separated values to array). It should return an `array`.

The simplest use case is only to manipulate the text input:

```javascript
const split = (text) => ['begin', text, 'end'];
```

If the function is omitted, behind the scenes the parser executes as if it would be:

```javascript
const split = (text, separate) => separate(text);
```

You can also alter the return array before returning it from the function:

```javascript
const split = (text, separate) => {
  const result = separate(text);
  result.map((i) => i.toUpperString());
  return result;
};
```

<a name="assign"></a>

### The `assign` function

This function has two arguments, the `array` input (result of the `split` function) and a default `assign` function (i.e. assign values from `array` to fields, one after another). It should return an `object`.

The simplest use case is only to manipulate the array input:

```javascript
const assign = (array) => ({
  timeStamp: new Date(),
  author: array[0],
  title: array[1],
});
```

If the function is omitted, behind the scenes the parser executes as if it would be:

```javascript
const assign = (array, assign) => assign(array);
```

You can also alter the return array before returning it from the function:

```javascript
const assign = (array, assign) => {
  const result = assign(array);
  result.hash = calculateSHA(JSON.stringify(result));
  return result;
};
```

<a name="cast"></a>

### The `cast` function

This function has two arguments, a `value` and the field. It should return a value of any type.

The simplest use case is only to manipulate the `value`:

```javascript
const cast = (value) => `###${value}###`;
```

If the function is omitted, behind the scenes the parser executes as if it would be:

```javascript
const cast = (value, field) => value;
```

You can also alter the `value` before returning it from the function:

```javascript
const cast = (value, field) => {
  let result = value;
  if (field.type === 'number') value = parseInt(value);
  return result;
};
```

const child_process = require('child_process');
jest.mock('child_process');

const file = '/path/file';
const args = ['arg1'];
const options = { encoding: 'utf8', maxBuffer: Infinity };
const delimiter = '\n';
const data = ['line1', 'line2', 'line3'];
child_process.__setData([data.join(delimiter)]);
const dynamicArgs = ['arg2'];
const parser = (line) => line;

const { ParsedFileOutput } = require('../src');
let stdout;

describe('ParsedFileOutput', () => {
  describe('Without a parser', () => {
    beforeEach(() => {
      stdout = ParsedFileOutput({ file, args, delimiter });
    });
    it('should return an array', async () => {
      const result = await stdout(dynamicArgs).asArray();
      expect(result).toEqual(data);
    });
    it('should return an iterable', async () => {
      const items = await stdout(dynamicArgs).asItems();
      const result = [];
      for await (const item of items) {
        result.push(item);
      }
      expect(result).toEqual(data);
    });
  });
  describe('With a parser', () => {
    beforeEach(() => {
      stdout = ParsedFileOutput({ file, args, delimiter, parser });
    });
    it('should return an array', async () => {
      const result = await stdout(dynamicArgs).asArray();
      expect(result).toEqual(data);
    });
    it('should return an iterable', async () => {
      const items = await stdout(dynamicArgs).asItems();
      const result = [];
      for await (const item of items) {
        result.push(item);
      }
      expect(result).toEqual(data);
    });
  });
  it('should be called with proper arguments', () => {
    expect(child_process.execFile).toHaveBeenLastCalledWith(
      file,
      [...args, ...dynamicArgs],
      options
    );
  });
});

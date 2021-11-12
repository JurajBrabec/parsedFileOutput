const child_process = require('child_process');
jest.mock('child_process');

const file = '/path/file';
const args = ['arg1'];
const options = { encoding: 'utf8', maxBuffer: Infinity };
const delimiter = '\n';
const data = ['line1', 'line2', 'line3'];
child_process.__setData([data.join(delimiter)]);
const dynamicArgs = ['arg2'];

const { SplitFileOutput } = require('../src');
let stdout;

describe('SplitFileOutput', () => {
  describe('returns a value', () => {
    it('should return an iterable, without delimiter', async () => {
      stdout = SplitFileOutput({ file, args });
      const splits = await stdout(dynamicArgs).asSplits();
      const result = [];
      for await (const item of splits) {
        result.push(item);
      }
      expect(result).toEqual(data);
    });
    it('should return an iterable, with delimiter', async () => {
      stdout = SplitFileOutput({ file, args, delimiter });
      const splits = await stdout(dynamicArgs).asSplits();
      const result = [];
      for await (const item of splits) {
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

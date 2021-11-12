const child_process = require('child_process');
jest.mock('child_process');

const file = '/path/file';
const args = ['arg1'];
const options = { encoding: 'utf8', maxBuffer: Infinity };
const data = ['line1', 'line2', 'line3'];
child_process.__setData(data);
const dynamicArgs = ['arg2'];

const { FileOutput } = require('../src');
let stdout;

describe('FileOutput', () => {
  describe('returns a value', () => {
    beforeEach(() => {
      stdout = FileOutput({ file, args });
    });
    it('should return a stream', async () => {
      const stream = await stdout(dynamicArgs).asStream();
      let result = '';
      for await (const chunk of stream) {
        result += chunk;
      }
      expect(result).toEqual(data.join(''));
    });
    it('should return a string', () => {
      const result = stdout(dynamicArgs).asString();
      return expect(result).resolves.toEqual(data.join(''));
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

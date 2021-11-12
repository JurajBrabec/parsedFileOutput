const { Parser } = require('../src');

const fields = { field1: 'string', field2: 'string' };

describe('Parser', () => {
  describe('without separator and quote char', () => {
    const parser = Parser({ fields });
    it('parses simple values', () => {
      const line = 'value1,value2';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: 'value2',
      });
    });
    it('parses quoted values', () => {
      const line = 'value1,"value2,value2"';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: '"value2,value2"',
      });
    });
  });
  describe('with separator and quote char', () => {
    const separator = ';';
    const quote = '`';
    const parser = Parser({ separator, quote, fields });
    it('parses simple values', () => {
      const line = 'value1;value2';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: 'value2',
      });
    });
    it('parses quoted values', () => {
      const line = 'value1;`value2;value2`';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: '`value2;value2`',
      });
    });
  });
  describe('with default split and assign', () => {
    const split = (text, fn) => fn(text);
    const assign = (array, fn) => fn(array);
    const parser = Parser({ fields, split, assign });
    it('parses simple values', () => {
      const line = 'value1,value2';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: 'value2',
      });
    });
    it('parses quoted values', () => {
      const line = 'value1,"value2,value2"';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: '"value2,value2"',
      });
    });
  });
  describe('with custom split and assign', () => {
    const split = (text) => text.split(',');
    const assign = (array) => ({ field1: array[0], field2: array[1] });
    const parser = Parser({ fields, split, assign });
    it('parses simple values', () => {
      const line = 'value1,value2';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: 'value2',
      });
    });
    it('does not parse quoted values', () => {
      const line = 'value1,"value2,value2"';
      const result = parser(line);
      expect(result).toEqual({
        field1: 'value1',
        field2: '"value2',
      });
    });
  });
  describe('with cast', () => {
    const cast = (value) => parseInt(value[5]);
    const parser = Parser({ fields, cast });
    it('parses simple values', () => {
      const line = 'value1,value2';
      const result = parser(line);
      expect(result).toEqual({
        field1: 1,
        field2: 2,
      });
    });
  });
});

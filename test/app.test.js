const { expect } = require('chai');
const { add, greet } = require('../index');

describe('Sample App', () => {
  describe('add()', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(2, 3)).to.equal(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, -1)).to.equal(-2);
    });
  });

  describe('greet()', () => {
    it('should return a greeting string with the given name', () => {
      expect(greet('Jenkins')).to.equal('Hello, Jenkins!');
    });
  });
});

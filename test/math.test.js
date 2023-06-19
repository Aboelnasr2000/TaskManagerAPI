import { calculateTip } from "../src/maths.js"
import expect  from "chai";
import assert from "assert";

describe('Number Comparison', function() {
  it('should compare two numbers', function() {
    assert.strictEqual(calculateTip(10,.3), 13, 'Numbers are not equal');
    // expect(13).toBe(13)
  });
});
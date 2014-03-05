/*globals require, describe, it*/

var assert = require('assert'),
  circle = require('../src/js/modules/circle');

describe('Circle Module', function () {

  describe('area', function () {
    it('should return PI * r * r', function () {
      assert.equal(3.141592653589793, circle.area(1));
      assert.equal(12.566370614359172, circle.area(2));
      assert.equal(28.274333882308138, circle.area(3));
      assert.equal(50.26548245743669, circle.area(4));
    });
  });

  describe('circumference', function () {
    it('should return 2PIr', function () {
      assert.equal(6.283185307179586, circle.circumference(1));
      assert.equal(12.566370614359172, circle.circumference(2));
      assert.equal(18.84955592153876, circle.circumference(3));
      assert.equal(25.132741228718345, circle.circumference(4));
    });
  });

});

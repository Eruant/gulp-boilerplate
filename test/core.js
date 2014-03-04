/*globals require, describe, it*/

var assert = require('assert'),
  circle = require('../src/js/modules/circle');

describe('Circle Module', function () {

  describe('area(r)', function () {
    it('should return PIr2', function () {
      assert.equal(3.141592653589793, circle.area(1));
      assert.equal(12.566370614359172, circle.area(2));
      assert.equal(28.274333882308138, circle.area(3));
    });
  });

});

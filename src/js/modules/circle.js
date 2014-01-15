var PI = Math.PI;

var area = function (r) {
  return PI * r * r;
};

var circumference = function (r) {
  return 2 * PI * r;
};

module.exports = {
  area: area,
  circumference: circumference
};

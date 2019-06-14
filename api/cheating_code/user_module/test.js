var sum = require('./module/sum');
var cal = require('./module/calculator');

console.log("sum result: "+sum(1, 2));
console.log("cal sum result: "+cal.sum(1, 2));
console.log("min sum result: "+cal.min(1, 2));
console.log("mul sum result: "+cal.mul(1, 2));
console.log("div sum result: "+cal.div(1, 2));

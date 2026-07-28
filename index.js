// Simple Node.js app used for the Jenkins CI assignments

function add(a, b) {
  return a + b;
}

function greet(name) {
  return `Hello, ${name}!`;
}

if (require.main === module) {
  console.log(greet('Jenkins'));
  console.log('2 + 3 =', add(2, 3));
}

module.exports = { add, greet };

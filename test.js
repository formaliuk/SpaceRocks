const fs = require('fs')

function countLines(fileUrl) {
  const report = fs.readFileSync(fileUrl, 'UTF-8');
  const parseLines = report.toString().replace(/-/g, "").split(" ").slice(-1)
  return parseInt(parseLines)
}

console.log(countLines('coverage/code_lines'))
console.log(countLines('coverage/test_lines'))


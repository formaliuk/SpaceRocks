import { readFileSync } from 'fs'
import { parse } from 'node-html-parser'
import fetch from 'node-fetch';
/*---------------*CONFIGURATION*---------------*/
const codeFile = 'coverage/code_lines'
const testFile = 'coverage/test_lines'
const doesMakePostRequest = true
const reportFile = 'coverage/lcov-report/index.html'
const projectId = '134'
const metricName1 = 'totalLinesOfCode'
const metricName2 = 'totalLinesOfTestCode'
const metricName3 = 'codeCoveragePercentage'
/*---------------------------------------------*/
const htmlCoverReport = readFileSync(reportFile, 'UTF-8')
const reportDocument = parse(htmlCoverReport)
let numberOfCodeLines = countLines(codeFile)
let numberOfTestLines = countLines(testFile)
let finalCoverage = pullCoverageContent(reportDocument)
const response = sendToStatisticServer()
console.log('Total code lines: ', countLines(codeFile))
console.log('Total test lines: ', countLines(testFile))
console.log('Total test coverage: ', pullCoverageContent(reportDocument))
console.log('Response: ', response)
/*---------------------------------------------*/
function countLines(fileUrl) {
  const report = readFileSync(fileUrl, 'UTF-8');
  const parseLines = report.toString().replace(/-/g, "").split(" ").slice(-1)
  return parseInt(parseLines)
}
//vsdvdjvn
function pullCoverageContent(reportDocument) {
  return reportDocument
    .querySelectorAll('.clearfix')[0]
    .textContent.replace(/\s/g, '')
    .split('%')[0];
}

function jsonData(value) {
  return {
    metricValue: Number(value),
  };
}

function metricFetch(projectId, metricName, metricValue) {
  fetch(
    'https://api.metrics.anadea.co/api/metrics?' +
    new URLSearchParams({
      projectId: projectId,
      metricName: metricName,
    }),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData(metricValue)),
    }
  )
    .then(response => response.json())
    .then(data => {
      console.log('Operation success!' + JSON.stringify(jsonData(metricValue)));
      console.log(data);
      return data;
    })
    .catch(err => {
      console.log('Error!');
      return err;
    });
}

function sendToStatisticServer() {
  if (!doesMakePostRequest)
    return 'Saving operation to statistic server is disabled';

  metricFetch(projectId, metricName1, numberOfCodeLines);
  metricFetch(projectId, metricName2, numberOfTestLines);
  metricFetch(projectId, metricName3, finalCoverage);
}
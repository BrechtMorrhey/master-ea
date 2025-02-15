import { parse, stringify } from 'csv';
import fs from 'node:fs';
import path from 'node:path';
import anova1 from '@stdlib/stats-anova1'

const inputFileName = 'companiesTransposed15022025.csv';
const outputFileName = `companiesResult_${Date.now()}.csv`;
// log current working directory
console.log(process.cwd());
// create filepaths
const inputFilePath = path.resolve(process.cwd(), `./data/companies/${inputFileName}`);
const outputFilePath = path.resolve(process.cwd(), `./data/companies/${outputFileName}`);
// create csv write stream
const writeStream = fs.createWriteStream(outputFilePath, 'utf8');
// create the stringifier
const stringifier = stringify({ delimiter: ';' });
// pipe the stringifier to the write stream
stringifier.pipe(writeStream);
// track whether we have handled the header
let isHeader = true;
let headerClasses;
let classes = {};

// read the csv file and iterate over the records in a stream
fs.createReadStream(inputFilePath, 'utf8').pipe(parse({ columns: false, delimiter: ';', from: 0 }))
    .on('error', function (err) {
        console.error(err.message);
    })
    .on('readable', function () {
        let inputRecord;
        let outputRecord;
        while (inputRecord = this.read()) {
            console.log(inputRecord);
            if (isHeader) {
                isHeader = false;
                // loop over the record and create classes
                inputRecord.forEach((column) => {
                    classes[column] = true;
                });
                // remove the question from the header classes
                headerClasses = inputRecord.slice(1);
                outputRecord = [
                    'Question',
                    'Statistic',
                    'PValue',
                    'Null hypothesis rejected?'
                ]
            } else {
                // parse the inputRecord to integers
                let numericInput = inputRecord.slice(1).map((value, index) => {
                    return parseInt(value);
                });
                // anova test the record
                const anova = anova1(numericInput, headerClasses, { decision: true });
                console.log(anova);
                // prepare the output record
                outputRecord = [
                    inputRecord[0],
                    anova.statistic,
                    anova.pValue,
                    anova.rejected.toString()
                ];
            }
            stringifier.write(outputRecord);

        }
    });
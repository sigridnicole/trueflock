const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvParser = require('csv').parse
const date = require('date-and-time');

const dataFilteredAccounts = [];
const dataPast30Days = [];

const readStream = fs.createReadStream('action log f - dbrand sample.csv');
const csvWriter = createCsvWriter({
  header: ['Account', 'Date', 'Target', 'Key', 'URL', 'UserId', 'Fback', 'Unf', 'IsPr', 'Ratio'],
  path: 'FilteredAccounts.csv'
});

const csvWriter2 = createCsvWriter({
  path: 'Past30Days.csv'
});

const dateNow = new Date();
let past30DaysDate = date.addDays(dateNow, -30);
past30DaysDate = date.format(past30DaysDate, 'YYYY/MM/DD HH:mm');

readStream
  .pipe(csvParser())
  .on('data', (row) => {

    if (row[1] >= past30DaysDate) {
      dataPast30Days.push(row);
    }

    if (row[0] === 'curio360' || row.Account === 'healinghearts' || row.Account === 'emmly' || row.Account === 'townout') {
      dataFilteredAccounts.push(row);
    }

  })
  .on('end', () => {

    console.log('CSV file successfully processed');

    csvWriter.writeRecords(dataFilteredAccounts)
      .then(() => {
        console.log('...Done');
      });

    csvWriter2.writeRecords(dataPast30Days)
      .then(() => {
        console.log('...Done');
      });
  })
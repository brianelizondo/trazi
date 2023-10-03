/**
* IMPORT/EXPORT CSV DATA FILE
* File to import data from CSV file to PostgreSQL database
*/
const fs = require('fs');
const csv = require('fast-csv');
const { Client } = require('pg');
const { DB_USER, DB_PASS, DB_NAME } = require('./config');

const db = new Client({
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

let cities = [];

// show progress bar for import/export process
function progressBar(percentage){
    const barFilled = '█';
    const barLong = 40;
    const progress = Math.floor(percentage / (100 / barLong));
    const progressBar = barFilled.repeat(progress);
  
    process.stdout.write(`Exporting data to trazi_db: [${progressBar}] ${percentage}%\r`);
  
    if (percentage === 100) {
        process.stdout.write('\n');
    }
}

// read csv file to database export
async function readCSVAndInsertData(){
    await db.connect();
    const stream = fs.createReadStream('./data/city_populations.csv');
    const csvStream = csv.parse({ headers: false });

    csvStream.on('data', async (row) => {
        cities.push({
            name: row[0].toLowerCase(),
            state: row[1].toLowerCase(),
            population: isNaN(row[2]) ? 0 : parseInt(row[2])
        });
    });

    csvStream.on('end', async () => {
        try {
            for(let i = 0; i < cities.length; i++){
                progressBar(Math.floor(((i + 1) * 100) / cities.length));
                const city = cities[i];

                await db.query(`
                    INSERT INTO city 
                        (city, 
                        state, 
                        population) 
                    VALUES 
                        ($1, $2, $3)`
                , [
                    city.name, 
                    city.state, 
                    city.population
                ]);
            }
            console.log('Data added successfully');
            db.end();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    stream.pipe(csvStream);
}

readCSVAndInsertData().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
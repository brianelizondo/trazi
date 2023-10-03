/**
* City model class
*/

class City {
    // Check if city exist
    static async checkCity(state, city) {
        // DB client connector
        const dbClient = await this.prototype.fastify.pg.connect();

        // Get info from DB
        const { rows: cityData } = await dbClient.query(
            `SELECT 
                city, state, population 
            FROM 
                city 
            WHERE 
                city=$1 AND state=$2`, 
        [city.toLowerCase(), state.toLowerCase()]);
        dbClient.release();

        // Return city population
        return cityData.length > 0;
    }

    // Get a city population
    static async getPopulation(state, city) {
        // DB client connector
        const dbClient = await this.prototype.fastify.pg.connect();

        // Get info from DB
        const { rows: cityData } = await dbClient.query(
            `SELECT 
                city,
                state,
                population 
            FROM 
                city 
            WHERE 
                state=$1 AND city=$2`, 
        [state.toLowerCase(), city.toLowerCase()]);
        dbClient.release();
        
        // Return city population
        return cityData[0].population;
    }

    // Upsert a city population
    static async upsertPopulation(state, city, newPopulation) {
        // DB client connector
        const dbClient = await this.prototype.fastify.pg.connect();

        // Check if the city exist
        const cityExists = await this.checkCity(state, city);
        
        if(cityExists){
            // update the city population
            await dbClient.query(
                `UPDATE 
                    city 
                SET 
                    population=$3 
                WHERE 
                    state=$1 AND city=$2`, 
            [state.toLowerCase(), city.toLowerCase(), newPopulation]);
            dbClient.release();

            return { statusCode: 200, message: 'State/City/Population updated' };
        }else{
            // create a new state/city/population
            await dbClient.query(
                `INSERT INTO city 
                    (state,
                    city,
                    population) 
                VALUES 
                    ($1, $2, $3)`, 
            [state.toLowerCase(), city.toLowerCase(), newPopulation]);
            dbClient.release();

            // return 201 code with message
            return { statusCode: 201, message: 'State/City/Population created' };
        }
    }
}
  
module.exports = City;
/**
* City controllers for the service
*/

// City class model
const City = require("../models/cityModel");

/**
* Given a state/city return the city population
* Returns { population }
* Returns 200 status and json response if found
* Returns 400 status and error if state/city not found
*/
async function getPopulation(req, reply) {
    const { state, city } = req.params;

    try {
        // Call the city model to get the city population
        const cityPopulation = await City.getPopulation(state, city);
        return { population: cityPopulation };
    } catch (err){
        reply.code(400).send({ error: 'State/City cant be found' });
        return;
    } 
}


/** 
* Given a state/city and a number in plain text to set as the population
* Returns { population }
* Returns 200 status if the data has updated a state/city that already existed
* Returns 201 status if the data was created instead of updated
* Returns 400 status and error if state/city not found
**/
async function upsertPopulation(req, reply) {
    const { state, city } = req.params;
    const newPopulation = parseInt(req.body);

    try {
        // Call the city to update the city population or the data was created instead of updated
        const cityUpsertPopulation = await City.upsertPopulation(state, city, newPopulation);
        reply.code(cityUpsertPopulation.statusCode).send({ message: cityUpsertPopulation.message });
        return;
    } catch (err){
        reply.code(400).send({ error: 'State/City cant be created or updated' });
        return;
    } 
}

// Export controllers
module.exports = {
    getPopulation,
    upsertPopulation  
  }
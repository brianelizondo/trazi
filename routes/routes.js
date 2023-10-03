/**
* Routes for the service
*/

// City controllers
const cityControllers = require('../controllers/cityController');

// STATE/CITY end-points
async function routes(fastify, options) {
    /** 
    * GET
    * Given a state/city return the city population
    **/
    fastify.get('/api/population/state/:state/city/:city', cityControllers.getPopulation);
    

    /** 
    * PUT
    * Given a state/city and a number in plain text to set as the population
    **/
    fastify.put('/api/population/state/:state/city/:city', cityControllers.upsertPopulation);
}
  
module.exports = routes;
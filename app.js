/**
* Citi Population Service App
*/
const { PORT, DB_NAME, DB_USER, DB_PASS } = require('./config');
const fastify = require('fastify')({
    logger: true
});
// City class model
const City = require('./models/cityModel');

// Add plugins to Fastify instance
// PostgreSQL plugin
fastify.register(require('@fastify/postgres'), {
    connectionString: `postgresql://${DB_USER}:${DB_PASS}@localhost/${DB_NAME}`
});
// CORS plugin
fastify.register(require('@fastify/cors'), { 
    origin: '*'
});

// Declare a route
fastify.register(require('./routes/routes'));
// Controller to handle routes not found
fastify.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ error: 'Route not Found' });
});

// Set the fastify instance to the City model
City.prototype.fastify = fastify;

// Run the server on port selected
fastify.listen({ port: PORT }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
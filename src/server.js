const Hapi = require('@hapi/hapi');
const routes = require('./routes');

/* ---------------- init async function to start hapi server ---------------- */
const init = async () => {
  // set server configurations
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '172.31.43.222',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  server.route(routes); // set routes

  await server.start(); // start the server?!

  // send message to server console
  // eslint-disable-next-line no-console
  console.log(`Server berjalan pada ${server.info.uri}`);
};

/* ---------------------------- init the server?! --------------------------- */
init();

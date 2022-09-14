const corsOption = {
  origin: [
    'http:/localhost:3000',
  ],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  credentials: true,
};
module.exports = corsOption;

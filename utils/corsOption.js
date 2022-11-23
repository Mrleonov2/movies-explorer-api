const corsOption = {
  origin: [
    'http://api.explorer.leonov.nomoredomains.club',
    'https://api.explorer.leonov.nomoredomains.club',
    'http://explorer.leonov.nomoredomains.club',
    'https://explorer.leonov.nomoredomains.club',
    'http:/localhost:3000',
    'https://api.explorer.leonov.nomoredomains.club/signup',
    'https://api.explorer.leonov.nomoredomains.club/signin',
  ],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'],
  credentials: true,
};
module.exports = corsOption;

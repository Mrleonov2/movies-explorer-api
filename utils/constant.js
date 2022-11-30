const mongoDbAddress = 'mongodb://localhost:27017/moviesdb';
const JWT_DEV = 'secret-code';
const emailValid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
module.exports = { mongoDbAddress, JWT_DEV, emailValid };

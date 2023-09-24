import axios from 'axios';

const url = 'http://10.0.2.2:3000';

const request = axios.create({
  baseURL: url,
});

export {request};

import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API}/api/v1/users/`
});

export default instance;

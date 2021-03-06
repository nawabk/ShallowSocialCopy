import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API}/api/v1/`,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
});

export default instance;

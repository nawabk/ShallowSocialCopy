import moment from 'moment';
export const getAuthHeader = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  };
};

export const API_URL = `${process.env.REACT_APP_API}/api/v1`;

export const SOCKET = `${process.env.REACT_APP_API}`;

export const avatarNameConvertetr = name => {
  if (name) {
    const splittedName = name.split(' ');
    if (splittedName.length === 1) {
      return name.charAt(0);
    } else {
      return (
        splittedName[0].charAt(0) +
        splittedName[splittedName.length - 1].charAt(0)
      );
    }
  }
};

export const calculateTimeElapse = date => {
  if (date) {
    return moment(date).fromNow();
  }
};

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/usr/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  verifyHash(hashvalue) {
    return axios.post(API_URL + 'verifyhash', { hashvalue });
  }

  getAll(email, accessToken) {
    return axios.post(API_URL, { email }, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  findByTitle(title, email, accessToken) {
    return axios.post(API_URL, { title, email }, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  downloadFile(fileName, accessToken) {
    return axios.get(API_URL + 'download/' + fileName, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      responseType:'blob'
    });
  }

}

export default new UserService();

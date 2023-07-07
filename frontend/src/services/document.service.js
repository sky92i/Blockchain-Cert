import axios from 'axios';

const API_URL = 'http://localhost:8080/api/doc/';

class DocumentService {
  getAll(accessToken) {
    return axios.get(API_URL, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  get(id, accessToken) {
    return axios.get(API_URL + id, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  create(data, accessToken) {
    return axios.post(API_URL, data, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  update(id, data, accessToken) {
    return axios.put(API_URL + id, data, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  delete(fileName, accessToken) {
    return axios.delete(API_URL + fileName, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  findByTitle(title, accessToken) {
    return axios.get(API_URL + '?title=' + title, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  checkTitleExists(data, accessToken) {
    return axios.post(API_URL + 'title', data, {
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

export default new DocumentService();
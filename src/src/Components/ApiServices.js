// src/ApiService.js
import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const ApiService = {
  getPosts: () => axios.get(`${API_BASE_URL}/posts`),
  getComments: (postId) => axios.get(`${API_BASE_URL}/posts/${postId}/comments`),
  deletePost: (postId) => axios.delete(`${API_BASE_URL}/posts/${postId}`),
};

export default ApiService;

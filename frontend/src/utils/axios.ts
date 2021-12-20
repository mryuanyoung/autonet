import axios from "axios";

export const Axios = axios.create({
  baseURL: 'http://localhost:8000'
})

Axios.interceptors.request.use(function(config){
  return config;
}, function(error){
  return Promise.reject(error);
})

Axios.interceptors.response.use(function(response){
  return response.data;
}, function(error){
  return Promise.reject(error);
})

export interface Response<T>{
  code: number,
  message: string,
  data: T
}

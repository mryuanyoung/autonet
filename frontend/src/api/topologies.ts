import { Axios, Response } from '@utils/axios';

export function getToplogies() {
  return Axios.get(`/toplogies`);
}

export function uploadFile(file:JSON) {
  return Axios.post(`/toplogy/upload`, file)
}
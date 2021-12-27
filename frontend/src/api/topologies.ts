import { Axios, Response } from '@utils/axios';

export function getToplogies() {
  return Axios.get(`/toplogies`);
}

export function uploadFile(file:JSON) {
  return Axios.post(`/toplogy/upload`, file)
}

export function activate(id: number){
  return Axios.get(`/toplogy/${id}/select`);
}
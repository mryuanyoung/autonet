import { Axios, Response } from '@utils/axios';

export function getTopologyInfo(id: number){
  return Axios.get(`/toplogy/${id}`);
}
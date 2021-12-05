import { Axios, Response } from '@utils/axios';

export function getToplogies() {
  return Axios.get(`/toplogies`);
}
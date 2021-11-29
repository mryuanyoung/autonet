import { Axios, Response } from '@utils/axios';

export function getToplogyInfo(id: number): Promise<Response<{ rawResult: string }>> {
  return Axios.get(`/toplogy/${id}`)
}
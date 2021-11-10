import { Axios, Response } from '@utils/axios';

export function sendCommandLine(id: number, command: string): Promise<Response<{ rawResult: string }>> {
  return Axios.post(`/toplogy/${id}/command`, {
    command
  })
}
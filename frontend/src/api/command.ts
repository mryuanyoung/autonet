import { Axios, Response } from '@utils/axios';

export function sendCommandLine(topoId: number, routerId: number, command: string): Promise<Response<{ rawResult: string }>> {
  return Axios.post(`/toplogy/${topoId}/command/${routerId}`, {
    command
  })
}
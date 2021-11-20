import { Axios, Response } from '@utils/axios'

export interface Port {
  id: number,
  name: string,
  ip: string,
  //子网掩码
  mask: string,
  //端口是否开启
  isUp: boolean
}

export interface Router {
  id: number,
  name: string,
  //端口数量
  portCount: number,
  //密码
  password: string,
  ports: Port[]
}

export const mockRouter: Router = {
  "id": 123,
  "name": "routerA",
  //端口数量
  "portCount": 4,
  //密码
  "password": '123456',
  "ports":[
    {
      "id": 123,
      "name": "s0/0/0",
      "ip": "192.168.1.1",
      //子网掩码
      "mask": "255.255.255.0",
      //端口是否开启
      "isUp": true
    },
    {
      "id": 124,
      "name": "f0/0/0",
      "ip": "192.168.1.2",
      //子网掩码
      "mask": "255.255.255.0",
      //端口是否开启
      "isUp": false
    }
  ]
}

export const defaultPortInfo: Partial<Port> = {
  name: '',
  ip: '',
  mask: '',
  isUp: false
}

export function getRouterInfo(topologyId: number, routerId: number): Promise<Response<Router>> {
  return Axios.get(`/toplogy/${topologyId}/router/${routerId}`)
}

export function updateRouter(topologyId: number, routerId: number, data: Partial<Port>){
  return Axios.post(`/toplogy/${topologyId}/router/${routerId}`, data)
}
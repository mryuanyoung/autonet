import { createContext, useContext, Dispatch, SetStateAction } from 'react';

export interface Context {
  deviceId: number,
  fresh: boolean,
  topologyId: number,
  setDeviceId: (deviceId: number) => void,
  setTopologyId: (topologyId: number) => void,
  setFresh: () => void,
}

export const AppContext = createContext<Context>({
  deviceId: -1,
  topologyId: -1,
  fresh: false,
  setDeviceId: function () { },
  setTopologyId: function () { },
  setFresh: function () { }
});

export function useAppContext() {
  const context = useContext(AppContext);
  if (context == null) {
    throw new Error("Context was undefined");
  }
  return context;
}
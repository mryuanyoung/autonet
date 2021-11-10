import { createContext, useContext, Dispatch, SetStateAction } from 'react';

export interface Context {
  deviceId: number,
  fresh: boolean,
  setDeviceId: (deviceId: number) => void,
  setFresh: () => void,
}

export const AppContext = createContext<Context>({
  deviceId: -1,
  fresh: false,
  setDeviceId: function () { },
  setFresh: function () { }
});

export function useAppContext() {
  const context = useContext(AppContext);
  if (context == null) {
    throw new Error("Context was undefined");
  }
  return context;
}
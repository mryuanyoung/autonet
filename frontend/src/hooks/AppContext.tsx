import { createContext, useContext, Dispatch, SetStateAction } from 'react';

export const AppContext = createContext({
  deviceId: -1,
  setDeviceId: function () { } as Dispatch<SetStateAction<number>>
});

export function useAppContext() {
  const context = useContext(AppContext);
  if (context == null) {
    throw new Error("Context was undefined");
  }
  return context;
}
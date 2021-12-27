import { useEffect, useState } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { AppContext, Context } from '@hooks/AppContext';
import Canvas from '@components/Canvas';
import TopologyMenu from '@components/ToplogyMenu';
import AttributionBox from '@components/AttributionBox';
import CommandLine from '@components/CommandLine';
import 'antd/dist/antd.css';
import { Simulate } from "react-dom/test-utils";

import select = Simulate.select;
import * as React from "react";

const { Sider, Content } = Layout;

export type Contents = { output: string, isEqual: boolean, idx: number }[]
export const ContCtx = React.createContext<{ content: Contents, setContent: React.Dispatch<React.SetStateAction<Contents>> }>({ content: [], setContent: () => { } });

function App() {

  const [state, setState] = useState<Pick<Context, 'deviceId' | 'fresh' | 'topologyId' | 'loading'>>({
    deviceId: 3,
    topologyId: 1,
    fresh: false,
    loading: false
  });

  const [content, setContent] = useState<Contents>([]);

  return (
    <AppContext.Provider
      value={{
        deviceId: state.deviceId,
        topologyId: state.topologyId,
        fresh: state.fresh,
        loading: false,
        setLoading: (state) => setState(obj => ({ ...obj, loading: state })),
        setDeviceId: (deviceId) => setState(obj => ({ ...obj, deviceId })),
        setTopologyId: (topologyId) => setState(obj => ({ ...obj, topologyId })),
        setFresh: () => setState(o => ({ ...o, fresh: !o.fresh }))
      }}
    >
      <Spin spinning={state.loading}>
        <Layout style={{ height: '100vh' }}>
          <Sider width={200} collapsible collapsedWidth={0} zeroWidthTriggerStyle={{ top: 0 }} >
            <TopologyMenu />
          </Sider>
          <Layout style={{ display: 'flex', flexDirection: 'row' }}>
            <Layout style={{ width: '40vw' }}>
              <Content><Canvas /></Content>
            </Layout>
            <ContCtx.Provider value={{ content, setContent }}>
              <Layout style={{ height: '100vh' }}>
                <Content style={{ height: '50vh' }}><AttributionBox /></Content>
                <Content style={{ height: '50vh' }}><CommandLine /></Content>
              </Layout>
            </ContCtx.Provider>
          </Layout>
        </Layout>
      </Spin>
    </AppContext.Provider>
  )
}

export default App

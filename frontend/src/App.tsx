import {useEffect, useState} from 'react';
import { Layout, Menu } from 'antd';
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

function App() {

  const [state, setState] = useState<Pick<Context, 'deviceId' | 'fresh' | 'topologyId'>>({
    deviceId: 3,
    topologyId: 1,
    fresh: false
  });

  return (
    <AppContext.Provider
      value={{
        deviceId: state.deviceId,
        topologyId: state.topologyId,
        fresh: state.fresh,
        setDeviceId: (deviceId) => setState(obj => ({ ...obj, deviceId })),
        setTopologyId: (topologyId) => setState(obj => ({ ...obj, topologyId })),
        setFresh: () => setState(o => ({ ...o, fresh: !o.fresh }))
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <Sider width={200} collapsible collapsedWidth={0} zeroWidthTriggerStyle={{ top: 0 }} >

        </Sider>
        <Layout style={{display: 'flex', flexDirection: 'row'}}>
          <Layout style={{width: '40vw'}}>
            <Content></Content>
          </Layout>
          <Layout style={{height: '100vh'}}>
            <Content style={{height: '50vh'}}><AttributionBox /></Content>
            <Content style={{height: '50vh'}}><CommandLine /></Content>
          </Layout>
        </Layout>
      </Layout>
    </AppContext.Provider>
  )
}

export default App

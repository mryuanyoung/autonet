import { useState } from 'react';
import { Layout } from 'antd';
import { AppContext, Context } from '@hooks/AppContext';
import Canvas from '@components/Canvas';
import AttrubutionBox from '@components/AttributionBox';
import CommandLine from '@components/CommandLine';
import 'antd/dist/antd.css';

const { Sider, Content } = Layout;

function App() {

  const [state, setState] = useState<Pick<Context, 'deviceId' | 'fresh'>>({
    deviceId: -1,
    fresh: false
  });

  return (
    <AppContext.Provider
      value={{
        deviceId: state.deviceId,
        fresh: state.fresh,
        setDeviceId: (deviceId) => setState(obj => ({ ...obj, deviceId })),
        setFresh: () => setState(o => ({...o, fresh: !o.fresh}))
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <Sider width={200} collapsible collapsedWidth={0} zeroWidthTriggerStyle={{ top: 0 }} >左侧边栏</Sider>
        <Layout style={{ height: '100%' }}>
          <Layout style={{ display: 'flex', flexDirection: 'row', height: '60%' }}>
            <Content style={{ width: '30vw' }}><Canvas /></Content>
            <Content><AttrubutionBox /></Content>
          </Layout>
          <Layout style={{ height: '40%' }}>
            <Content><CommandLine /></Content>
          </Layout>
        </Layout>
      </Layout>
    </AppContext.Provider>
  )
}

export default App

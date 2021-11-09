import { useState } from 'react';
import { Layout } from 'antd';
import { AppContext } from '@hooks/AppContext';
import Canvas from '@components/Canvas';
import AttrubutionBox from '@components/AttributionBox';
import CommandLine from '@components/CommandLine';
import 'antd/dist/antd.css';

const { Sider, Content } = Layout;

function App() {

  const [state, setState] = useState(-1);

  return (
    <AppContext.Provider value={{ deviceId: state, setDeviceId: setState }}>
      <Layout style={{ height: '100vh' }}>
        <Sider width={200} collapsible collapsedWidth={0} zeroWidthTriggerStyle={{ top: 0 }} >左侧边栏</Sider>
        <Layout >
          <Layout style={{ display: 'flex', flexDirection: 'row', height: '30vh' }}>
            <Content style={{ width: '30vw' }}><Canvas /></Content>
            <Content><AttrubutionBox /></Content>
          </Layout>
          <Layout>
            <Content><CommandLine /></Content>
          </Layout>
        </Layout>
      </Layout>
    </AppContext.Provider>
  )
}

export default App

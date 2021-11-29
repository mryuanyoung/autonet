import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { AppContext, Context } from '@hooks/AppContext';
import Canvas from '@components/Canvas';
import AttrubutionBox from '@components/AttributionBox';
import CommandLine from '@components/CommandLine';
import 'antd/dist/antd.css';
import { Simulate } from "react-dom/test-utils";
import select = Simulate.select;

const { Sider, Content } = Layout;

function App() {

  const [state, setState] = useState<Pick<Context, 'deviceId' | 'fresh' | 'topologyId'>>({
    deviceId: -1,
    topologyId: -1,
    fresh: false
  });

  const topologies = [
    {
      id: 1,
      name: "拓扑一"
    },
    {
      id: 2,
      name: "拓扑二"
    },
    {
      id: 3,
      name: "拓扑三"
    }
  ];
  const selectTopology = (e: any) => {
    const topologyId = e.key;
    //todo,刷新当前的拓扑项目
  };

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
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={selectTopology}>
            {topologies.map((value) => {
              return <Menu.Item key={value.id} >
                {value.name}
              </Menu.Item>
            })}
          </Menu>
        </Sider>
        <Layout style={{display: 'flex', flexDirection: 'row'}}>
          <Layout style={{width: '40vw'}}>
            <Content><Canvas /></Content>
          </Layout>
          <Layout style={{height: '100vh'}}>
            <Content style={{height: '50vh'}}><AttrubutionBox /></Content>
            <Content style={{height: '50vh'}}><CommandLine /></Content>
          </Layout>
        </Layout>
      </Layout>
    </AppContext.Provider>
  )
}

export default App

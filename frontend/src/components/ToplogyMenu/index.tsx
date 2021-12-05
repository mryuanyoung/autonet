import { useAppContext } from '@hooks/AppContext';
import { getToplogies } from '@api/topologies';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import {useEffect, useState} from "react";
import * as React from "react";
import { Menu } from 'antd';
import './index.css';

function TopologyMenu() {
  const [topologies,setTopologies]=useState( [
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
  ]);
  const { topologyId,setTopologyId } = useAppContext();
  useEffect(() => {
    // if (topologyId === -1 || deviceId === -1) {
    //   return;
    // }
    (async function () {
      try {
        const res = await getToplogies();
        setTopologies(res.data);
        setTopologyId(res.data[0].id);
      }
      catch (err) {
      }
    })()
  }, [topologies]);
  const selectTopology = (e: any) => {
    const topologyId = e.key;
    setTopologyId(topologyId);
  };

  return(<div>
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={selectTopology}>
      {topologies.map((value) => {
        return <Menu.Item key={value.id} >
          {value.name}
        </Menu.Item>
      })}
    </Menu>
  </div>);
}

export default TopologyMenu;
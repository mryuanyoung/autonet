import { useAppContext } from '@hooks/AppContext';
import { getToplogies,uploadFile } from '@api/topologies';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import {useEffect, useState} from "react";
import * as React from "react";
import { Menu} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
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
  const [new_upload,setNew_upload]=useState(false);
  useEffect(() => {
    // if (topologyId === -1 || deviceId === -1) {
    //   return;
    // }
    (async function () {
      try {
        const res = await getToplogies();
        setTopologies(res.data.info);
        setTopologyId(res.data.info[0].id);
        setNew_upload(false);
      }
      catch (err) {
      }
    })()
  },[new_upload]);
  const selectTopology = (e: any) => {
    const topologyId = e.key;
    setTopologyId(topologyId);
  };
  const uploadFileContent=async function (content:JSON) {
    const res=await uploadFile(content);
    setNew_upload(true);
    // @ts-ignore
    document.getElementById("upload_button").value="";
  };
  const handleUpload=(e:any) => {
    e.preventDefault();

    let file = e.target.files[0];
    console.log(file);
    var reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function (res) {
      // @ts-ignore
      console.log(res.target.result);
      // @ts-ignore
      if (res.target.result ) {
        // @ts-ignore
        uploadFileContent(JSON.parse(res.target.result));
      }
    }
  };


  return(<div id="topologyMenu">
    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={selectTopology}>
      {topologies.map((value) => {
        return <Menu.Item key={value.id} >
          {value.name}
        </Menu.Item>
      })}
    </Menu>
    <input id="upload_button" type="file" placeholder="请选择文件上传" onChange={handleUpload}/>
  </div>);
}

export default TopologyMenu;
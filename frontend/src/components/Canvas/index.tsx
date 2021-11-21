import { useAppContext } from '@hooks/AppContext';
import { getToplogyInfo } from '@api/canvas';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import './Canvas.css';
import {useEffect, useState} from "react";
import * as React from "react";
import Router from './Router.png'

function getNodeInfo(e: any, obj:any) {
  alert('在右边查看' + obj.part.data.name + '的信息');
}

function deleteNode(e: any, obj: any ) {
  alert('删除' + obj.part.data.name);
}

function addNode(e: any) {
  alert("增加新的节点");
}

function save(){
  alert("保存此拓扑配置");
}

function openTopologyFile() {
  alert("在右边打开配置文件");
}

function initDiagram() {
  const $ = go.GraphObject.make;
  const diagram =
    $(go.Diagram,
      {
        'undoManager.isEnabled': true,  // enable undo & redo
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: $(go.GraphLinksModel,
          {
            linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
          })
      });
  diagram.nodeTemplate =
    $(go.Node, "Horizontal",
      { background: "#44CCFF" },
      $(go.Picture,
        { margin: 10, width: 50, height: 50, background: "red" },
        new go.Binding("source")),
      $(go.TextBlock, "Default Text",
        { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
        new go.Binding("text", "name")),
      {
        contextMenu:     // define a context menu for each node
          $("ContextMenu",  // that has one button
            $("ContextMenuButton",
              $(go.TextBlock, "查看"),
              { click: getNodeInfo }),
            $("ContextMenuButton",
              $(go.TextBlock, "删除"),
              { click: deleteNode }),
          )  // end Adornment
      }
    );
  diagram.linkTemplate =
    $(go.Link,
      { curve: go.Link.Bezier },// the whole link panel
      $(go.Shape) , // the link shape, default black stroke
      $(go.Panel, "from",
        { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright },
        $(go.TextBlock, { margin: 3 },
          new go.Binding("text", "from_port"))),
      $(go.Panel, "to",
        { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright },
        $(go.TextBlock, { margin: 3 },
          new go.Binding("text", "to_port")))
    );
  // also define a context menu for the diagram's background
  diagram.contextMenu =
    $("ContextMenu",
      // no binding, always visible button:
      $("ContextMenuButton",
        $(go.TextBlock, "增加新路由器"),
        { click: addNode }),
      $("ContextMenuButton",
        $(go.TextBlock, "查看配置文件"),
        { click: openTopologyFile }),
        $("ContextMenuButton",
          $(go.TextBlock, "保存拓扑配置"),
          { click: save })
    );

  return diagram;
}

function handleModelChange(changes: any) {
  console.log(changes)
}
function Canvas() {
  const { deviceId,setDeviceId } = useAppContext();
  const [data,setdata]=useState({nodes:[],links:[]});
  const [loading, setLoading] = useState(false);



  useEffect(()=>{
    const getDeviceInfo = async () => {
      if (!deviceId) return;

      try {
        setLoading(true);

        // const res = await getToplogyInfo(deviceId);
        // todo 接入后端
        const res={
          "code": 0,
          "message": "success",
          "data": {
            "id": 2323,
            "name": "toplogy1",
            //true表示该文件是正在生效的拓扑文件
            "isActive": true,
            //路由器数量
            "routerCount": 3,
            //路由器列表
            "routers":[
              {
                "id": 123,
                "name": "router1",
                "ip": "172.16.0.1",
                //子网掩码
                "mask": "255.255.0.0",
                //端口数量
                "portCount": 4,
                //密码
                "password": 123456,
                "ports":[
                  {
                    "id": 123,
                    "name": "s0/0/0",
                    "isUp": true
                  }
                ]
              },
              {
                "id": 124,
                "name": "routerB",
                "ip": "172.16.0.1",
                //子网掩码
                "mask": "255.255.0.0",
                //端口数量
                "portCount": 4,
                //密码
                "password": 123456,
                "ports":[
                  {
                    "id": 124,
                    "name": "s0/0/0",
                    "isUp": true
                  },
                  {
                    "id": 125,
                    "name": "s0/1/0",
                    "isUp": true
                  }
                ]
              },
              {
                "id": 125,
                "name": "routerC",
                "ip": "172.16.0.1",
                //子网掩码
                "mask": "255.255.0.0",
                //端口数量
                "portCount": 4,
                //密码
                "password": 123456,
                "ports":[
                  {
                    "id": 126,
                    "name": "s0/0/0",
                    "isUp": true
                  }
                ]
              }
            ],
            //网线数量
            cabelCount: 6,
            //网线列表
            "cabels":[
              {
                "id": 1,
                "Router1Id":123,
                "port1":{
                  "id": 123,
                  "name": "s0/0/0",
                  "isUp": true
                },
                "Router2Id":124,
                "port2":{
                  "id": 124,
                  "name": "s0/0/0",
                  "isUp": true
                }
              },
              {
                "id": 2,
                "Router1Id":124,
                "port1":{
                  "id": 125,
                  "name": "s0/1/0",
                  "isUp": true
                },
                "Router2Id":125,
                "port2":{
                  "id": 126,
                  "name": "s0/0/0",
                  "isUp": true
                }
              }
            ]
          }
        };
        const nodes=res.data.routers.map((value)=>{
          return {
            "key": value.id,
            "name": value.name,
            "source":Router
          }
        });
        const links=res.data.cabels.map((value)=>{
          return {
            "id":value.id,
            "from":value.Router1Id,
            "to":value.Router2Id,
            "from_port":value.port1.name,
            "to_port":value.port2.name
          }
        });
        console.log(nodes,links);
        // @ts-ignore
        setdata({"nodes":nodes,links:links});
        setLoading(false);
      }
      catch (err) {
        console.log(err);
      }
    };
    getDeviceInfo()
  },[]);

  return (
    <div style={{paddingTop:'30px'}}>
      ...
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={data.nodes}
        linkDataArray={data.links}
        onModelChange={handleModelChange}
      />
      ...
    </div>
  );
}

export default Canvas;
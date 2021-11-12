import { useAppContext } from '@hooks/AppContext';
import { getToplogyInfo } from '@api/canvas';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import './Canvas.css';
import {useState} from "react";
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
  const [nodes,setNodes]=useState({
    "id": 123,
    "name": "routerA",
    "source":Router
  });
  const [links,setLinks]=useState([]);
  const [loading, setLoading] = useState(false);

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
              "name": "routerA",
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
            }
          ],
          //网线数量
          cabelCount: 6,
          //网线列表
          "cabels":[
            {
              "id": 123,
              "port1Id":123,
              "port2Id":234
            }
          ]
        }
      };
      const routers=res.data.routers;
      const nodes=routers.map((value)=>{
        return {
          "id": value.id,
          "name": value.name,
          "source":Router
        }
      });
      console.log(nodes);
      setLoading(false);
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{paddingTop:'30px'}}>
      ...
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={[
          { key: "1" ,name: "Router1",   source: Router},
          { key: "2" ,name: "Router2",   source: Router},
          { key: "3" ,name: "Router3",   source: Router}
        ]}
        linkDataArray={[
          { from: "1", to: "2" },
          { from: "2", to: "3" }
        ]}
        onModelChange={handleModelChange}
      />
      ...
    </div>
  );
}

export default Canvas;
import { useAppContext } from '@hooks/AppContext';
import { getTopologyInfo } from '@api/canvas';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import './Canvas.css';
import {useEffect, useState} from "react";
import * as React from "react";
import Router from './Router.png'


function Canvas() {
  const { deviceId,setDeviceId,fresh,setFresh,topologyId } = useAppContext();
  const [data,setData]=useState({nodes:[],links:[]});

  const getNodeInfo=(e: any, obj:any) =>{
    setDeviceId(obj.part.data.key);
  };
  const getLinkInfo=(e: any, obj:any)=> {
    console.log(obj.part.data);
  };
 const openTopologyFile=()=> {
    alert("在右边打开配置文件");
  };
  const deleteLink=(e: any, obj:any) =>{
    console.log(obj.part.data);
    //todo,删除网线的接口
    //alert("后端删除该网线");
    e.diagram.commandHandler.deleteSelection();
  };

  const initDiagram=()=> {
    const $ = go.GraphObject.make;
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': true,  // enable undo & redo
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          model: $(go.GraphLinksModel,
            {
              linkFromPortIdProperty: "fromPort",  // required information:
              linkToPortIdProperty: "toPort",      // identifies data property names
              linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
            })
        });
    const portSize = new go.Size(10, 10);
    diagram.nodeTemplate =
      $(go.Node, "Table",
        {
          locationObjectName: "BODY",
          locationSpot: go.Spot.Center,
          selectionObjectName: "BODY",
        },
        // the body
        $(go.Panel, "Auto",
          {
            row: 1, column: 1, name: "BODY",
            stretch: go.GraphObject.Fill
          },
          { background: "#44CCFF" },
          $(go.Picture,
            { margin: 10, width: 80, height: 80, background: "red" },
            new go.Binding("source")),
          $(go.TextBlock, "Default Text",
            { margin: 12, stroke: "blue", font: "bold 16px sans-serif" },
            new go.Binding("text", "name")),
        ),  // end Auto Panel body
        // the Panel holding the top port elements, which are themselves Panels,
        // created for each item in the itemArray, bound to data.topArray
        $(go.Panel, "Horizontal",
          new go.Binding("itemArray", "topArray"),
          {
            row: 0, column: 1,
            itemTemplate:
              $(go.Panel,"Vertical",
                {
                  _side: "top",
                  fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                  fromLinkable: true, toLinkable: true, cursor: "pointer",
                },
                new go.Binding("portId", "portId"),
                $(go.TextBlock, "Default Text",
                  new go.Binding("text", "portId")),
                $(go.Shape, "Rectangle",
                  {
                    stroke: null, strokeWidth: 0,
                    desiredSize: portSize,
                    margin: new go.Margin(0, 40),
                    fill:"#fae3d7"
                  })
              )  // end itemTemplate
          }
        ),  // end Horizontal Panel
        $(go.Panel, "Horizontal",
          new go.Binding("itemArray", "bottomArray"),
          {
            row: 2, column: 1,
            itemTemplate:
              $(go.Panel,"Vertical",
                {
                  _side: "bottom",
                  fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                  fromLinkable: true, toLinkable: true, cursor: "pointer",
                  //contextMenu: portMenu
                },
                new go.Binding("portId", "portId"),
                $(go.Shape, "Rectangle",
                  {
                    stroke: null, strokeWidth: 0,
                    desiredSize: portSize,
                    margin: new go.Margin(0, 40),
                    fill:"#fae3d7"
                  }),
                $(go.TextBlock, "Default Text",
                  new go.Binding("text", "portId")),
                {
                  contextMenu:     // define a context menu for each node
                    $("ContextMenu",  // that has one button
                      $("ContextMenuButton",
                        $(go.TextBlock, "查看端口"),
                        { click: getNodeInfo }),
                    )  // end Adornment
                }
                /*new go.Binding("fill", "blue"))*/
              )  // end itemTemplate
          }
        ),  // end Horizontal Panel
        {
          contextMenu:     // define a context menu for each node
            $("ContextMenu",  // that has one button
              $("ContextMenuButton",
                $(go.TextBlock, "查看路由器"),
                { click: getNodeInfo }),
            )  // end Adornment
        }
      );  // end Node
    diagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.Bezier},  // link route should avoid nodes
        $(go.Shape) , // the link shape, default black stroke
        /* $(go.Shape, { toArrow: "Standard" }),*/
        /*      $(go.TextBlock, "from", new go.Binding("text", "fromPort"),
                { segmentIndex: 0, segmentOffset: new go.Point(NaN, NaN),}),
              $(go.TextBlock, "to", new go.Binding("text", "toPort"),
                { segmentIndex: -1, segmentOffset: new go.Point(NaN, NaN),}),*/
        {
          contextMenu:     // define a context menu for each node
            $("ContextMenu",
              $("ContextMenuButton",
                $(go.TextBlock, "查看连接"),
                { click: getLinkInfo }),
              $("ContextMenuButton",
                $(go.TextBlock, "删除连接"),
                { click: deleteLink })
            )
        }
      );
    // also define a context menu for the diagram's background
    diagram.contextMenu =
      $("ContextMenu",
        $("ContextMenuButton",
          $(go.TextBlock, "查看配置文件"),
          { click: openTopologyFile })
      );

    return diagram;
  };

  function handleModelChange(changes: any) {
    if(changes.modifiedLinkData!==undefined){
      //todo,后端新增网线的接口
      //alert("后端新增该网线");
      console.log(changes.modifiedLinkData)
    }
  }

  useEffect(() => {
    if (!topologyId) return;
    (async function () {
      try {
        const res = await getTopologyInfo(topologyId);
        console.log(res.data)
        const nodes=res.data.routers.map((value: any)=>{
          return {
            "key": value.id,
            "name": value.name,
            "source":Router,
            "topArray":value.ports.map((port:any)=>{
              if(port.name=="s0/0/0"||port.name=="s0/0/1"){
                return {
                  "portId":port.name
                }
              }
            }),
            "bottomArray":value.ports.map((port:any)=>{
              if(port.name=="f0/0"||port.name=="f0/1"){
                return {
                  "portId":port.name
                }
              }
            })
          }
        });
        const links=res.data.cabels.map((value: any)=>{
          return {
            "id":value.id,
            "from":value.r1Id,
            "to":value.r2Id,
            "fromPort":value.port1Name,
            "toPort":value.port2Name
          }
        });
        console.log(nodes,links);
        // @ts-ignore
        setData({"nodes":nodes,"links":links});
      }
      catch (err) {
        console.log(err);
      }
    })()
  }, [topologyId, deviceId]);

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
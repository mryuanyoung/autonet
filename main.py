import json
from fastapi import FastAPI, UploadFile, File, Body
from enum import Enum
from toplogies import toplogies
from lib.toplogy import Toplogy
from models.models import Ports, StaticRoutes, OSPF

app = FastAPI()


@app.get("/")
async def read_root():
    return {"message": "Hello World!"}


@app.get("/items/{item_id}")
async def get_item(item_id):
    return {'item_id': item_id}


# 获取拓扑列表
@app.get("/toplogies")
async def getToplogies():
    return toplogies.toJson()


# 查看拓扑
@app.get("/toplogy/{id}")
async def getToplogy(id):
    return toplogies.getToplogy(id)


# 查看拓扑文件
@app.get("/toplogy/{id}/file")
async def getToplogyFile(id):
    return toplogies.getToplogyFile(id)


# 查看路由器配置
@app.get("/toplogy/{id}/router/{routerId}")
async def getRouter(id, routerId):
    return toplogies.getRouter(routerId)

# 查看路由器配置文件
@app.get("/toplogy/{id}/router/{routerId}/file")
async def getRouterFile(id, routerId):
    return toplogies.getRouterFile(routerId)


class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"


@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name == ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}

    return {"model_name": model_name, "message": "Have some residuals"}


@app.get("/files/{file_path:path}")
async def read_file(file_path: str):
    return {"file_path": file_path}


# 通过上传配置文件，进行配置
@app.post("/toplogy/upload")
async def file_upload(my_file: UploadFile = File(...)):
    temp_file = await my_file.read()
    file_to_str = str(temp_file, 'utf-8')
    new_topology = Toplogy(conf=json.loads(file_to_str))
    print(new_topology)
    toplogies.addToplogy(new_topology)

# 修改路由器的hostname, 示例url:
# http://127.0.0.1:8000/toplogy/1/updateRouter/1/hostname?name=test
@app.post("/toplogy/{id}/updateRouter/{routerId}/hostname")
async def changeRouterName(id, routerId, name: str):
    return toplogies.changeRouterSetting(routerId, name=name)

# 修改路由器的ports, Body示例
'''
{
    "ports": [
    {
        "name": "S0/0/0",
        "ip": "192.168.12.2",
        "mask": "255.255.255.0",
        "isUp": true
    },
    {
        "name": "loopback0",
        "ip": "1.1.1.1",
        "mask": "255.255.255.0",
        "isUp": true
    }
]
}
'''
@app.post("/toplogy/{id}/updateRouter/{routerId}/ports")
async def changeRouterPorts(id, routerId, ports: Ports):
    return toplogies.changeRouterSetting(routerId, ports=ports.ports)


# 修改路由器的静态路由, Body示例
'''
{
  "staticRoute": [
    {
      "ip": "1.1.1.0",
      "mask": "255.255.255.0",
      "passBy": "s0/0/0"
    },
    {
      "ip": "2.2.2.0",
      "mask": "255.255.255.0",
      "passBy": "192.168.1.2"
    }
  ]
}
'''

@app.post("/toplogy/{id}/updateRouter/{routerId}/static")
async def changeRouterStaticRoutes(id, routerId, routes: StaticRoutes):
    return toplogies.changeRouterSetting(routerId, staticRoute=routes.staticRoute)

# 修改路由器ospf, Body示例
'''
{
  "ospf": [
    {
      "processId": 1,
      "isUp": true,
      "networks": [
        {
          "ip": "192.168.10.0",
          "mask": "0.0.0.255",
          "area": 0
        }
      ]
    }
  ]
}
'''

@app.post("/toplogy/{id}/updateRouter/{routerId}/ospf")
async def changeRouterOSPF(id, routerId, ospf: OSPF):
    return toplogies.changeRouterSetting(routerId, ospf=ospf.ospf)

fake_db = [1, 23, 456]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 2):
    return fake_db[skip: skip + limit]



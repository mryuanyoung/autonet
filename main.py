import json
from fastapi import FastAPI, UploadFile, File, Body
from enum import Enum
from toplogies import toplogies
from lib.toplogy import Toplogy
from models.models import Ports, StaticRoutes, OSPF, ToplogyModel, TestFileModel
from models.defineConst import FAILURE_INFO
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    # "http://api.zwnsyw.com",
    # "https://api.zwnsyw.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



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
    return toplogies.getRouter(routerId, file='')


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


# # 通过上传配置文件，进行配置
# @app.post("/toplogy/upload")
# async def file_upload(my_file: UploadFile = File(...)):
#     temp_file = await my_file.read()
#     file_to_str = str(temp_file, 'utf-8')
#     new_topology = Toplogy(conf=json.loads(file_to_str))
#     print(new_topology)
#     toplogies.addToplogy(new_topology)

# 通过上传配置文件的JSON字符串，进行配置
@app.post("/toplogy/upload")
async def uploadToplogy(file: ToplogyModel):
    try:
        newToplogy = Toplogy(conf={"name": file.name, "routers": file.routers, "cabels": file.cabels})
        return toplogies.addToplogy(newToplogy)
    except:
        return FAILURE_INFO


async def file_upload(my_file: UploadFile = File(...)):
    print("???")
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

# 选择路由生效
@app.get("/toplogy/{id}/select")
async def activateRouter(id):
    return toplogies.decideActiveTop(id)

# 上传测试文件并测试，body示例
'''
{
    "test": [
    {
        "input": "show ip route",
        "output": "Codes: C - connected, S - static, I - IGRP, R - RIP, M - mobile, B - BGP\n       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area\n       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2\n       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP\n       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area\n       * - candidate default, U - per-user static route, o - ODR\n       P - periodic downloaded static route\n\nGateway of last resort is not set\n\n     1.0.0.0/24 is subnetted, 1 subnets\nC       1.1.1.0 is directly connected, Loopback0\n     2.0.0.0/24 is subnetted, 1 subnets\nS       2.2.2.0 is directly connected, Serial2/0\n     3.0.0.0/24 is subnetted, 1 subnets\nS       3.3.3.0 [1/0] via 172.17.0.2\nC    172.16.0.0/16 is directly connected, FastEthernet0/0\nC    172.17.0.0/16 is directly connected, Serial2/0\nS    172.18.0.0/16 [1/0] via 172.17.0.2"
    }]
}
'''
@app.post("/toplogy/{id}/router/{routerId}/upload")
async def uploadTestFile(id, routerId, test: TestFileModel):
    return toplogies.executeTest(id, routerId, test.test)

# 查看OSPF
@app.get("/toplogy/{id}/router/{routerId}/ospf")
async def getRouterOSPF(id, routerId):
    return toplogies.getRouter(routerId, ospf='')

# 查看静态路由
@app.get("/toplogy/{id}/router/{routerId}/static")
async def getRouterStatic(id, routerId):
    return toplogies.getRouter(routerId, static='')

fake_db = [1, 23, 456]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 2):
    return fake_db[skip: skip + limit]



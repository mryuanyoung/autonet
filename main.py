import json
from fastapi import FastAPI, UploadFile, File
from enum import Enum
from toplogies import toplogies
from lib.toplogy import Toplogy

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






fake_db = [1, 23, 456]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 2):
    return fake_db[skip: skip + limit]



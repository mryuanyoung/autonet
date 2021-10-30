from fastapi import FastAPI
from enum import Enum

app = FastAPI()


@app.get("/")
async def read_root():
    return {"message": "Hello World!"}


@app.get("/items/{item_id}")
async def get_item(item_id):
    return {'item_id': item_id}


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


fake_db = [1, 23, 456]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 2):
    return fake_db[skip: skip + limit]
from pydantic import BaseModel
class Ports(BaseModel):
    ports: list

class StaticRoutes(BaseModel):
    staticRoute: list

class OSPF(BaseModel):
    ospf: list

class ToplogyModel(BaseModel):
    name: str
    routers: list
    cabels: list
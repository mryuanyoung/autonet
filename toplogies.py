from lib.toplogy import Toplogy
from models.toplogyMaps import topIDMap, routerIDMap
from models.defineConst import SUCCESS_INFO, FAILURE_INFO
from tools.functions import getObejectFromMap
import json


class Toplogies:

    def __init__(self):
        self.__toplogies = []
        # 当前生效的拓扑图
        self.__currentActiveTop = None

    # 决定当前应该生效的top
    def decideActiveTop(self, toplogy):
        if self.__currentActiveTop:
            self.__currentActiveTop.deActivate()
        toplogy.activate()
        self.__currentActiveTop = toplogy

    # 默认新建拓扑时，将正在生效的拓扑设为失效，并将该拓扑设为生效
    def addToplogy(self, toplogy):
        self.decideActiveTop(toplogy)
        self.__toplogies.append(toplogy)
        topIDMap[toplogy.getID()] = toplogy

    # 查看拓扑信息
    def getToplogy(self, topId):
        toplogy = getObejectFromMap(topId, topIDMap)
        if not toplogy:
            return FAILURE_INFO
        SUCCESS_INFO['data'] = toplogy.toJson()
        return SUCCESS_INFO

    # 查看拓扑文件信息
    def getToplogyFile(self, topId):
        toplogy = getObejectFromMap(topId, topIDMap)
        if not toplogy:
            return FAILURE_INFO
        SUCCESS_INFO['data'] = toplogy.toJsonFile()
        return SUCCESS_INFO

    # 查看路由器信息
    def getRouter(self, routerId):
        routerId = int(routerId)
        if routerId not in routerIDMap.keys():
            return FAILURE_INFO
        router = routerIDMap[routerId]
        SUCCESS_INFO['data'] = router.toJson()
        return SUCCESS_INFO

    def getRouterFile(self, routerId):
        routerId = int(routerId)
        if routerId not in routerIDMap.keys():
            return FAILURE_INFO
        router = routerIDMap[routerId]
        SUCCESS_INFO['data'] = router.toJsonFile()
        return SUCCESS_INFO

    def changeRouterSetting(self, routerId, **kwargs):
        routerId = int(routerId)
        if routerId not in routerIDMap.keys():
            return FAILURE_INFO
        router = routerIDMap[routerId]
        router.enterConfigMode()
        if 'name' in kwargs:
            router.configHost(kwargs['name'])
            SUCCESS_INFO['data'] = router.toSimpleJson()
        elif 'ports' in kwargs:
            router.configPort(kwargs['ports'])
            SUCCESS_INFO['data'] = router.toJsonFile()['ports']
        elif 'staticRoute' in kwargs:
            router.configStaticRoute(kwargs['staticRoute'])
            SUCCESS_INFO['data'] = router.toJsonFile()["staticRoute"]
        elif 'ospf' in kwargs:
            router.configOSPF(kwargs['ospf'])
            SUCCESS_INFO['data'] = router.toJsonFile()["ospf"]
        router.exit()
        return SUCCESS_INFO

    # 查看拓扑列表
    def toJson(self):
        SUCCESS_INFO['data'] = {
                    "count": len(self.__toplogies),
                    "info": list(map(lambda x: x.toSimpleJson(), self.__toplogies))
                }
        return SUCCESS_INFO

#
# if __name__ == "__main__":
defaultConfFileName = "./example/static.json"
defaultConfFile = open(defaultConfFileName, "r")
defaultTop = Toplogy(conf=json.load(defaultConfFile))
toplogies = Toplogies()
toplogies.addToplogy(defaultTop)

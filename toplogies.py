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

    def __getRouterFromID__(self, routerId):
        routerId = int(routerId)
        if routerId not in routerIDMap.keys():
            return None
        router = routerIDMap[routerId]
        return router

    # 决定当前应该生效的top
    def decideActiveTop(self, toplogyId):
        if self.__currentActiveTop:
            self.__currentActiveTop.deActivate()
        toplogyId = int(toplogyId)
        toplogy = topIDMap[toplogyId]
        toplogy.activate()
        self.__currentActiveTop = toplogy
        return toplogy.toJson()

    # 默认新建拓扑时，将正在生效的拓扑设为失效，并将该拓扑设为生效
    def addToplogy(self, toplogy):
        topIDMap[toplogy.getID()] = toplogy
        self.__toplogies.append(toplogy)
        return SUCCESS_INFO

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

    # 获取路由器信息
    def getRouter(self, routerId, **kwargs):
        router = self.__getRouterFromID__(routerId)
        if not router:
            return FAILURE_INFO
        if 'file' in kwargs:
            SUCCESS_INFO['data'] = router.toJsonFile()
        elif 'ospf' in kwargs:
            SUCCESS_INFO['data'] = router.toJsonFile()['ospf']
        elif 'static' in kwargs:
            SUCCESS_INFO['data'] = router.toJsonFile()['staticRoute']
        else:
            SUCCESS_INFO['data'] = router.toJson()
        return SUCCESS_INFO


    def changeRouterSetting(self, routerId, **kwargs):
        router = self.__getRouterFromID__(routerId)
        if not router:
            return FAILURE_INFO
        if router.isActivate():
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

    def executeTest(self, topId, routerId, test):
        toplogy = getObejectFromMap(topId, topIDMap)
        if not toplogy or not toplogy.isActivate():
            return FAILURE_INFO
        router = self.__getRouterFromID__(routerId)
        if not router:
            return FAILURE_INFO
        router.login()
        results = []
        for case in test:
            res = router.executeTest(case['input'], case['output'])
            results.append(res)
        SUCCESS_INFO['data'] = results
        return SUCCESS_INFO



# 静态路由
defaultStaticFileName = "./example/static.json"
defaultStaticFile = open(defaultStaticFileName, "r")
defaultStatic = Toplogy(conf=json.load(defaultStaticFile))
defaultStaticFile.close()

# 单域OSPF
defaultSingleOSPFFileName = "./example/singleOSPF.json"
defaultSingleOSPFFile = open(defaultSingleOSPFFileName, "r")
defaultSingleOSPF = Toplogy(conf=json.load(defaultSingleOSPFFile))
defaultSingleOSPFFile.close()

# 多域OSPF
defaultMultipleOSPFFileName = "./example/multipleOSPF.json"
defaultMultipleOSPFFile = open(defaultMultipleOSPFFileName, "r")
defaultMultipleOSPF = Toplogy(conf=json.load(defaultMultipleOSPFFile))
defaultMultipleOSPFFile.close()

# 添加默认拓扑
toplogies = Toplogies()
toplogies.addToplogy(defaultStatic)
toplogies.addToplogy(defaultSingleOSPF)
toplogies.addToplogy(defaultMultipleOSPF)
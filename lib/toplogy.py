from models.defineConst import TOPLOGY_NAME_PRE
from tools.counter import counter
from tools.functions import option
from lib.router import Router
from models.toplogyMaps import routerIDMap, cabelIDMap
from lib.cabel import Cabel


class Toplogy:

    def __init__(self, **kwargs):
        self.__id = counter.generateTopID()
        self.__isActivate = False
        self.__name = TOPLOGY_NAME_PRE + str(self.__id)
        self.__conf = ""
        self.__routers = []
        self.__cabels = []
        if 'conf' in kwargs:
            self.__initByFile__(kwargs['conf'])

    def __initByFile__(self, conf):
        self.__name = option(self.__name, conf['name'])
        self.__conf = option(self.__conf, conf)
        for routerConf in conf['routers']:
            router = Router(conf=routerConf)
            self.addRouter(router)
        for cabelConf in conf['cabels']:
            cabel = Cabel(conf=cabelConf)
            self.addCabel(cabel)

    def addRouter(self, router):
        self.__routers.append(router)
        routerIDMap[router.getID()] = router

    def addCabel(self, cabel):
        self.__cabels.append(cabel)
        cabelIDMap[cabel.getID()] = cabel

    def getID(self):
        return self.__id

    def getName(self):
        return self.__name

    def toSimpleJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "isActive": self.__isActivate}

    def toJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "isActive": self.__isActivate,
                "routerCount": len(self.__routers),
                "routers": list(map(lambda x: x.toSimpleJson(), self.__routers)),
                "cabelCount": len(self.__cabels),
                "cabels": list(map(lambda  x: x.toSimpleJson(), self.__cabels))}

    def toJsonFile(self):
        return self.__conf

    #激活拓扑图
    def activate(self):
        self.__isActivate = True
        for router in self.__routers:
            router.activate()

    #失效拓扑图
    def deActivate(self):
        self.__isActivate = False
        for router in self.__routers:
            router.enterConfigMode()
            router.deActivate()
            router.exit()

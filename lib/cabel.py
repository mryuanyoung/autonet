from models.defineConst import IP_UNDEFINED, MASK_UNDEFINED, PORT_NAME_PRE, ID_UNDEFINED, NAME_UNDEFINED
from tools.counter import counter
from tools.functions import option
class Cabel:
    def __init__(self, **kwargs):
        self.__id = counter.generateCabelID()
        self.__r1 = ID_UNDEFINED
        self.__p1 = NAME_UNDEFINED
        self.__r2 = ID_UNDEFINED
        self.__p2 = NAME_UNDEFINED
        if 'conf' in kwargs and 'minId' in kwargs:
            self.__initByFile__(kwargs['conf'], kwargs['minId'])

    def __initByFile__(self, conf, minId):
        self.__r1 = option(self.__r1, conf['r1'] + minId - 1)
        self.__p1 = option(self.__p1, conf['p1'])
        self.__r2 = option(self.__r2, conf['r2'] + minId - 1)
        self.__p2 = option(self.__p2, conf['p2'])

    def toSimpleJson(self):
        return {"id": self.__id,
                "r1Id": self.__r1,
                "port1Name": self.__p1,
                "r2Id": self.__r2,
                "port2Name": self.__p2}

    def toJsonFile(self):
        return {"r1": self.__r1,
                "p1": self.__p1,
                "r2": self.__r2,
                "p2": self.__p2}

    def getID(self):
        return self.__id

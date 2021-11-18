from models.defineConst import IP_UNDEFINED, MASK_UNDEFINED, PORT_NAME_PRE
from tools.counter import counter
from tools.functions import option
class Port:
    def __init__(self, **kwargs):
        self.__id = counter.generatePortID()
        self.__conf = ""
        self.__ip = IP_UNDEFINED
        self.__mask = MASK_UNDEFINED
        self.__name = PORT_NAME_PRE + str(self.__id)
        self.__type = 0
        self.__isUp = False
        if 'conf' in kwargs:
            self.__initByFile__(kwargs['conf'])

    def __initByFile__(self, conf):
        # print(conf)
        self.__name = option(self.__name, conf['name'])
        self.__conf = option(self.__conf, conf)
        self.__ip = option(self.__ip, conf['ip'])
        self.__mask = option(self.__mask, conf['mask'])

    def getID(self):
        return self.__id

    def toSimpleJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "isUp": self.__isUp}

    def toJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "ip": self.__ip,
                "mask": self.__mask,
                "isUp": self.__isUp}



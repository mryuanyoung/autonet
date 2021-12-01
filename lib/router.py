from models.defineConst import IP_UNDEFINED, ROUTER_NAME_PRE, MASK_UNDEFINED, PASSWD_UNDEFINED
from tools.counter import counter
from tools.functions import option
from lib.port import Port
from models.toplogyMaps import portIDMap
from tools.telnetClient import telnetClient
from time import sleep


class Router:

    def __init__(self, **kwargs):
        self.__id = counter.generateRouterID()
        self.__conf = ""
        self.__ip = IP_UNDEFINED
        self.__mask = MASK_UNDEFINED
        self.__name = ROUTER_NAME_PRE+str(self.__id)
        self.__passwd = PASSWD_UNDEFINED
        self.__ports = []
        if 'conf' in kwargs:
            self.__initByFile__(kwargs['conf'])

    def __initByFile__(self, conf):
        self.__conf = option(self.__conf, conf)
        self.__name = option(self.__name, conf['name'])
        self.__ip = option(self.__ip, conf['ip'])
        self.__mask = option(self.__mask, conf['mask'])
        self.__passwd = option(self.__passwd, conf['password'])
        sleep(0.5)
        telnetClient.login_router(self.__ip, self.__passwd)
        telnetClient.enable(self.__passwd)
        telnetClient.conf()
        telnetClient.change_name(self.__name)
        for portConf in conf['ports']:
            port = Port(conf=portConf)
            self.addPort(port)
        #配置静态路由
        for route_conf in conf['staticRoute']:
            telnetClient.config_static_route(route_conf['ip'], route_conf['mask'], route_conf['passBy'])
        #配置单域OSPF
        for ospf_conf in conf['ospf']:
            telnetClient.config_ospf(ospf_conf['processId'], ospf_conf['networks'])
        telnetClient.exit_router()


    #添加端口
    def addPort(self, port):
        self.__ports.append(port)
        portIDMap[port.getID()] = port

    def getID(self):
        return self.__id

    def toSimpleJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "ip": self.__ip,
                "mask": self.__mask,
                "portCount": len(self.__ports),
                "password": self.__passwd,
                "ports": list(map(lambda x: x.toSimpleJson(), self.__ports))}

    def toJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "ip": self.__ip,
                "mask": self.__mask,
                "portCount": len(self.__ports),
                "password": self.__passwd,
                "ports": list(map(lambda x: x.toJson(), self.__ports))}



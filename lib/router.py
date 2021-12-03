import json

from models.defineConst import IP_UNDEFINED, ROUTER_NAME_PRE, MASK_UNDEFINED, PASSWD_UNDEFINED, SLEEP_TIME
from tools.counter import counter
from tools.functions import option, getPortRegexFromName
from lib.port import Port
from models.toplogyMaps import portIDMap, portRegexMap
from tools.telnetClient import telnetClient
from time import sleep
import re


class Router:

    def __init__(self, **kwargs):
        self.__id = counter.generateRouterID()
        self.__conf = ""
        self.__ip = IP_UNDEFINED
        self.__mask = MASK_UNDEFINED
        self.__name = ROUTER_NAME_PRE+str(self.__id)
        self.__passwd = PASSWD_UNDEFINED
        self.__ports = dict()
        if 'conf' in kwargs:
            self.__initByFile__(kwargs['conf'])

    def __initByFile__(self, conf):
        self.__conf = option(self.__conf, conf)
        self.__ip = option(self.__ip, conf['ip'])
        self.__mask = option(self.__mask, conf['mask'])
        self.__passwd = option(self.__passwd, conf['password'])
        sleep(SLEEP_TIME)
        #进入配置模式
        self.enterConfigMode()
        #配置hostname
        self.configHost(conf['name'])
        #配置端口
        self.configPort(conf['ports'])
        #配置静态路由
        self.configStaticRoute(conf['staticRoute'])
        #配置单域OSPF
        self.configOSPF(conf['ospf'])
        #退出路由器
        self.exit()


    def exit(self):
        try:
            telnetClient.exit_router()
        except:
            print("连接失败")

    def enterConfigMode(self):
        try:
            telnetClient.login_router(self.__ip, self.__passwd)
            telnetClient.enable(self.__passwd)
            telnetClient.set_terminal_length()
            telnetClient.conf()
        except:
            print("连接失败")

    def configHost(self, name):
        try:
            telnetClient.change_name(name)
        except:
            print("连接失败")
        self.__name = name
        self.__conf['name'] = name

    def portInSelfPorts(self, port):
        regexes = [re.compile(port.getRegex()) for port in self.__ports.values()]
        for regex in regexes:
            if regex.match(port['name']):
                return True
        return False


    # 默认在config模式
    def configPort(self, ports):

        oldPorts = [port.toJsonFile() for port in self.__ports.values()]

        #需要新加入的端口
        wait4Add = [port for port in ports if not self.portInSelfPorts(port)]

        #需要重新配置的端口
        wait4Config = [port for port in ports if self.portInSelfPorts(port) and port not in oldPorts]

        wait4ConfigPorts = list(map(lambda x: portRegexMap[getPortRegexFromName(x['name'])], wait4Config))

        #需要删除配置的端口
        wait4Delete = [port for port in self.__ports.values() if port.toJsonFile() not in ports and port not in wait4ConfigPorts]

        #新加入端口
        for portConf in wait4Add:
            port = Port(conf=portConf)
            self.addPort(port)

        #配置已有的端口
        for i in range(len(wait4ConfigPorts)):
            wait4ConfigPorts[i].changePort(wait4Config[i])
            self.__ports[wait4ConfigPorts[i].getID()] = wait4ConfigPorts[i]

        #删除不再使用的端口配置
        for port in wait4Delete:
            port.deleteConf()
            self.__ports.pop(port.getID())

        #同步conf文件
        self.__conf['ports'] = ports



    # 默认在config模式
    def configStaticRoute(self, staticRoute):
        wait4Delete = [route for route in self.__conf['staticRoute'] if route not in staticRoute]
        wait4Config = [route for route in staticRoute if route not in self.__conf['staticRoute']]
        try:
            for routeConf in wait4Delete:
                telnetClient.delete_static_route(routeConf['ip'], routeConf['mask'], routeConf['passBy'])
            for routeConf in wait4Config:
                telnetClient.config_static_route(routeConf['ip'], routeConf['mask'], routeConf['passBy'])
        except:
            print("连接失败")
        self.__conf['staticRoute'] = staticRoute

    # 默认在config模式
    def configOSPF(self, ospf):
        try:
            processIds = list(set(map(lambda x: x['processId']), ospf))
            for processId in processIds:
                telnetClient.delete_ospf(processId)
            for ospfConf in ospf:
                telnetClient.config_ospf(ospfConf['processId'], ospfConf['networks'])
        except:
            print("连接失败")
        self.__conf['ospf'] = ospf

    # 默认在config模式下
    def deleteConf(self):
        for port in self.__ports:
            port.deleteConf()
        try:
            for routeConf in self.__conf['staticRoute']:
                telnetClient.delete_static_route(routeConf['ip'], routeConf['mask'], routeConf['passBy'])
            for ospfConf in self.__conf['ospf']:
                telnetClient.delete_ospf(ospfConf['processId'])
        except:
            print("连接失败")


    #添加端口
    def addPort(self, port):
        self.__ports[port.getID()] = port
        portIDMap[port.getID()] = port
        portRegexMap[port.getRegex()] = port

    def getID(self):
        return self.__id

    def toSimpleJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "ip": self.__ip,
                "mask": self.__mask,
                "portCount": len(self.__ports.values()),
                "password": self.__passwd,
                "ports": list(map(lambda x: x.toSimpleJson(), self.__ports.values()))}

    def toJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "ip": self.__ip,
                "mask": self.__mask,
                "portCount": len(self.__ports.values()),
                "password": self.__passwd,
                "ports": list(map(lambda x: x.toJson(), self.__ports.values()))}

    def toJsonFile(self):
        return self.__conf

if __name__ == "__main__":
    staticR1 = [
                {
                    "ip": "1.1.1.0",
                    "mask": "255.255.255.0",
                    "passBy": "s0/0/0"
                },
                {
                    "ip": "2.2.2.0",
                    "mask": "255.255.255.0",
                    "passBy": "s0/0/0"
                }
            ]
    staticR2 = [
                {
                    "ip": "1.1.1.0",
                    "mask": "255.255.255.0",
                    "passBy": "s0/0/0"
                },
                {
                    "ip": "3.3.3.0",
                    "mask": "255.255.255.0",
                    "passBy": "s0/0/1"
                }
            ]
    alreadyConfig = [route for route in staticR1 if route in staticR2]
    wait4Delete = [route for route in staticR1 if route not in staticR2]
    wait4Config = [route for route in staticR2 if route not in staticR1]
    print(wait4Delete)
    print(wait4Config)


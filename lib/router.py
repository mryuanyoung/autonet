import json

from models.defineConst import IP_UNDEFINED, ROUTER_NAME_PRE, MASK_UNDEFINED, PASSWD_UNDEFINED, SLEEP_TIME, \
    DEFAULT_PORTS, TEST_SLEEP_TIME
from tools.counter import counter
from tools.functions import option, getPortRegexFromName
from lib.port import Port
from models.toplogyMaps import portIDMap, portRegexMap
from tools.telnetClient import telnetClient
from time import sleep
import re
import logging

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(filename)s[line:%(lineno)d func:%(funcName)s] - %(levelname)s: %(message)s')


class Router:

    def __init__(self, **kwargs):
        self.__id = counter.generateRouterID()
        self.__conf = dict()
        self.__ip = IP_UNDEFINED
        self.__mask = MASK_UNDEFINED
        self.__name = ROUTER_NAME_PRE + str(self.__id)
        self.__passwd = PASSWD_UNDEFINED
        self.__ports = dict()
        for portName in DEFAULT_PORTS:
            port = Port(name=portName)
            self.addPort(port)
        self.__isActivate = False
        if 'conf' in kwargs:
            self.__initByFile__(kwargs['conf'])

    def __initByFile__(self, conf):
        # self.__conf = option(self.__conf, conf)
        self.__ip = option(self.__ip, conf['ip'])
        self.__mask = option(self.__mask, conf['mask'])
        self.__passwd = option(self.__passwd, conf['password'])
        self.config(conf)
        # 配置端口
        self.configPort(conf['ports'])
        self.__conf = {"name": self.__name,
                       "ip": self.__ip,
                       "mask": self.__mask,
                       "password": self.__passwd,
                       "ports": list(map(lambda p: p.toJsonFile(), self.__ports.values())),
                       "staticRoute": conf['staticRoute'],
                       "ospf": conf["ospf"]}

    def config(self, conf):
        # 进入配置模式
        # self.enterConfigMode()
        # 配置hostname
        self.configHost(conf['name'])
        # 配置静态路由
        self.configStaticRoute(conf['staticRoute'])
        # 配置单域OSPF
        self.configOSPF(conf['ospf'])
        # 退出路由器
        # self.exit()

    def activate(self):
        self.__isActivate = True
        sleep(SLEEP_TIME)
        self.enterConfigMode()
        for port in self.__ports.values():
            port.activate()
        self.config(self.__conf)
        self.exit()
        sleep(SLEEP_TIME)

    def deActivate(self):
        self.deleteConf()
        for port in self.__ports.values():
            port.deActivate()
        self.exit()
        self.__isActivate = False
        sleep(SLEEP_TIME)


    def exit(self):
        if self.__isActivate:
            try:
                telnetClient.exit_router()
            except:
                logging.info("退出路由器失败." + self._get_msg_())
                # print("连接失败")
    def exitTest(self):
        if self.__isActivate:
            try:
                telnetClient.logout()
                telnetClient.logout()
            except:
                logging.info("退出路由器失败." + self._get_msg_())

    def login(self):
        if self.__isActivate:
            try:
                telnetClient.login_router(self.__ip, self.__passwd)
                telnetClient.enable(self.__passwd)
                telnetClient.set_terminal_length()
            except:
                logging.info("login失败." + self._get_msg_())

    # activate的情况下可调用
    def executeTest(self, command, output):
        try:
            realOutput = telnetClient.exec_cmd(command)
            sleep(TEST_SLEEP_TIME)
        except:
            realOutput = "执行失败." + self._get_msg_()
            logging.info(realOutput)
        return {"output": realOutput, "isEqual": realOutput == output}




    def enterConfigMode(self):
        if self.__isActivate:
            try:
                self.login()
                telnetClient.conf()
            except:
                logging.info("进入config模式失败." + self._get_msg_())

    def configHost(self, name):
        if self.__isActivate:
            try:
                telnetClient.change_name(name)
            except:
                logging.info("修改名称失败." + self._get_msg_())
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

        # 需要新加入的端口
        wait4Add = [port for port in ports if not self.portInSelfPorts(port)]


        # 需要重新配置的端口
        wait4Config = [port for port in ports if self.portInSelfPorts(port) and port not in oldPorts]

        wait4ConfigPorts = list(map(lambda x: portRegexMap[str(self.getID())+getPortRegexFromName(x['name'])], wait4Config))


        # 新加入端口
        for portConf in wait4Add:
            port = Port(conf=portConf)
            if self.__isActivate:
                port.activate()
            self.addPort(port)

        # 配置已有的端口
        for i in range(len(wait4ConfigPorts)):
            wait4ConfigPorts[i].changePort(wait4Config[i])
            self.__ports[wait4ConfigPorts[i].getID()] = wait4ConfigPorts[i]
            if self.__isActivate:
                wait4ConfigPorts[i].activate()
        # 同步conf文件
        self.__conf['ports'] = list(map(lambda p: p.toJsonFile(), self.__ports.values()))



    # 默认在config模式
    def configStaticRoute(self, staticRoute):
        if self.__isActivate:
            wait4Delete = [route for route in self.__conf['staticRoute'] if route not in staticRoute]
            wait4Config = [route for route in staticRoute if route not in wait4Delete]
            try:
                for routeConf in wait4Delete:
                    telnetClient.delete_static_route(routeConf['ip'], routeConf['mask'], routeConf['passBy'])
                for routeConf in wait4Config:
                    telnetClient.config_static_route(routeConf['ip'], routeConf['mask'], routeConf['passBy'])
            except:
                logging.info('配置静态路由失败.' + self._get_msg_() + 'static route: ' + str(staticRoute))
        self.__conf['staticRoute'] = staticRoute

    # 默认在config模式
    def configOSPF(self, ospf):
        if self.__isActivate:
            try:
                processIds = list(set(map(lambda x: x['processId'], ospf)))
                for processId in processIds:
                    telnetClient.delete_ospf(processId)
                for ospfConf in ospf:
                    telnetClient.config_ospf(ospfConf['processId'], ospfConf['networks'])
            except Exception as ex:
                logging.info('配置ospf失败.' + self._get_msg_() + 'ospf: ' + str(ospf))
        self.__conf['ospf'] = ospf

    # 默认在config模式下
    def deleteConf(self):
        if self.__isActivate:
            try:
                for routeConf in self.__conf['staticRoute']:
                    telnetClient.delete_static_route(routeConf['ip'], routeConf['mask'], routeConf['passBy'])
                for ospfConf in self.__conf['ospf']:
                    telnetClient.delete_ospf(ospfConf['processId'])
            except:
                logging.info('删除配置失败.' + self._get_msg_())


    # 添加端口
    def addPort(self, port):
        self.__ports[port.getID()] = port
        portIDMap[port.getID()] = port
        portRegexMap[str(self.getID())+port.getRegex()] = port

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
                "isActive": self.__isActivate,
                "ip": self.__ip,
                "mask": self.__mask,
                "portCount": len(self.__ports.values()),
                "password": self.__passwd,
                "ports": list(map(lambda x: x.toJson(), self.__ports.values()))}

    def toJsonFile(self):
        return self.__conf

    def isActivate(self):
        return self.__isActivate

    def _get_msg_(self):
        return 'RouterMsg:: name: {}, id: {}, ip: {}'.format(self.__name, self.__id, self.__ip)


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


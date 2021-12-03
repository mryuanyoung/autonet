from models.defineConst import IP_UNDEFINED, MASK_UNDEFINED, PORT_NAME_PRE, DEFAULT_PATTERN
from tools.counter import counter
from tools.functions import option
from tools.telnetClient import telnetClient
import re
import logging

import logging

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(filename)s[line:%(lineno)d func:%(funcName)s] - %(levelname)s: %(message)s')


class Port:
    def __init__(self, **kwargs):
        self.__id = counter.generatePortID()
        self.__conf = ""
        self.__ip = IP_UNDEFINED
        self.__mask = MASK_UNDEFINED
        self.__name = PORT_NAME_PRE + str(self.__id)
        self.__type = 0
        self.__isUp = False
        self.__pattern = ""
        if 'conf' in kwargs:
            self.__initByFile__(kwargs['conf'])

    def __configPort__(self):
        try:
            telnetClient.config_port(self.__name, self.__ip, self.__mask, self.__isUp)
        except:
            logging.info("配置port失败." + self._get_msg())
            # print("连接失败")

    def deleteConf(self):
        try:
            telnetClient.delete_port_conf(self.__name, self.__ip, self.__mask)
        except:
            logging.info("删除port配置失败." + self._get_msg())
            # print("连接失败")

    def __initByFile__(self, conf):
        self.changePort(conf)

    def __generateReAndName__(self, name):
        self.__name = name
        pattern = re.compile(DEFAULT_PATTERN)
        m = pattern.match(name)
        if m:
            portLetters = m.group(1)
            portNumber = m.group(2)
            name = portLetters[0].lower() + portNumber
            self.__pattern = "(" + "[" + name[0] + name[0].upper() + "]" + "\\D*" + ")" \
                             + "(" + portNumber + ")"

        else:
            logging.info("修改port失败." + "newName: " + name + self._get_msg())
            # logging.info("[port: changePort 49]: 修改端口失败")

    def changePort(self, conf):
        self.__generateReAndName__(conf['name'])
        self.__conf = option(self.__conf, conf)
        self.__ip = option(self.__ip, conf['ip'])
        self.__mask = option(self.__mask, conf['mask'])
        self.__isUp = option(self.__ip, conf["isUp"])
        try:
            self.__configPort__()
        except:
            logging.info('修改port配置失败.'+'newConf: '+str(conf)+self._get_msg())
            # logging.info("[port: changePort]: 修改端口失败")

    def getID(self):
        return self.__id

    def getRegex(self):
        return self.__pattern

    def _get_msg(self):
        return 'PortMsg:: name:{}, id: {}, ip: {}'.format(self.__name, self.__id, self.__ip, )

    def toSimpleJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "isUp": self.__isUp}

    def toJson(self):
        return {"id": self.__id,
                "name": self.__name,
                "regex": self.__pattern,
                "ip": self.__ip,
                "mask": self.__mask,
                "isUp": self.__isUp}

    def toJsonFile(self):
        return self.__conf


if __name__ == "__main__":
    pattern = re.compile(DEFAULT_PATTERN)
    s1 = "s0/0/0"
    s2 = "Serial0/0/0"
    s3 = "f0/1"
    s4 = "FastEth0/1"
    m = pattern.match(s2)
    if m:
        portLetters = m.group(1)
        portNumber = m.group(2)
        name = portLetters[0].lower() + portNumber
        geneP = "(" + "[" + name[0] + name[0].upper() + "]" + "\\D*" + ")" \
                + "(" + portNumber + ")"
        print(name, geneP)
        pattern = re.compile(geneP)
        m = pattern.match(s1)
        print(m.group(1))
        print(m.group(2))

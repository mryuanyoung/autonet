import re

from models.defineConst import DEFAULT_PATTERN


def option(name, x):
    if x:
        return x
    return name

def getObejectFromMap(id, map):
    id = int(id)
    if id not in map.keys():
        return None
    return map[id]

def getPortRegexFromName(name):
    pattern = re.compile(DEFAULT_PATTERN)
    m = pattern.match(name)
    if m:
        portLetters = m.group(1)
        portNumber = m.group(2)
        name = portLetters[0].lower() + portNumber
        geneP = "(" + "[" + name[0] + name[0].upper() + "]" + "\\D*" + ")" \
                + "(" + portNumber + ")"
        return geneP
    #TODO:错误处理
    else:
        return ""

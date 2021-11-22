def option(name, x):
    if x:
        return x
    return name

def getObejectFromMap(id, map):
    id = int(id)
    if id not in map.keys():
        return None
    return map[id]

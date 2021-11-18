class Counter:
    def __init__(self):
        self.__topCount = 0
        self.__routerCount = 0
        self.__portCount = 0
        self.__cabelCount = 0

    def generateTopID(self):
        self.__topCount+=1
        return self.__topCount

    def generateRouterID(self):
        self.__routerCount+=1
        return self.__routerCount

    def generatePortID(self):
        self.__portCount+=1
        return self.__portCount

    def generateCabelID(self):
        self.__cabelCount+=1
        return self.__cabelCount

counter = Counter()








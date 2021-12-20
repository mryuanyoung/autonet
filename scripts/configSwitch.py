from models.defineConst import SWITCH_IP, SWITCH_TELNET_PASSWORD, SWITCH_PASSWORD
from tools.telnetClient import TelnetClient

if __name__ == "__main__":
    telnetClient = TelnetClient()
    telnetClient.login(SWITCH_IP, SWITCH_TELNET_PASSWORD)
    telnetClient.conf()
    commandFile = open("./switchCommands.txt", 'r')
    commands = commandFile.readlines()
    commandFile.close()
    for command in commands:
        telnetClient.exec_cmd(command)


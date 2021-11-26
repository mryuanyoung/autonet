import telnetlib
import time
from models.defineConst import SWITCH_PASSWORD, SWITCH_TELNET_PASSWORD, SWITCH_IP, ENABLE_ROOT

class TelnetClient:
    def __init__(self):
        self.tn = telnetlib.Telnet()

    def input(self, cmd):
        self.tn.write(cmd.encode('ascii') + b'\n')

    def get_output(self, sleep_seconds=2):
        time.sleep(sleep_seconds)
        return self.tn.read_very_eager().decode('ascii')

    def login_router(self, host_ip, password):
        telnetClient.exec_cmd("telnet " + host_ip)
        telnetClient.enable(password)

    def login(self, host_ip, password):
        try:
            self.tn.open(host_ip)
        except:
            print('连接失败')
        self.tn.read_until(b'Password: ')
        self.input(password)
        login_result = self.get_output()
        print(login_result)
        if 'Login incorrect' in login_result:
            print('用户名或密码错误')
            return False
        print('登陆成功')
        return True

    def logout(self):
        self.input('exit')

    def enable(self, password):
        self.exec_cmd(ENABLE_ROOT)
        self.exec_cmd(password)

    def conf(self):
        self.exec_cmd("conf terminal")

    def end(self):
        self.exec_cmd("end")


    def exec_cmd(self, cmd):
        self.input(cmd)
        res = self.get_output()
        print("===================")
        print(res)
        print("===================")
        return res

telnetClient = TelnetClient()
telnetClient.login(SWITCH_IP, SWITCH_TELNET_PASSWORD)
telnetClient.enable(SWITCH_PASSWORD)

    # tc.logout()
if __name__ == "__main__":

    telnetClient.exec_cmd("sh ip route")
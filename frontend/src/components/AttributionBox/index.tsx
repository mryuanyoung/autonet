import { useAppContext } from '@hooks/AppContext';
import { useContext, useEffect, useState } from 'react';
import { Card, Empty, Form, Tag, Input, Button, Spin, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { getRouterInfo, updatePort, mockRouter, Router, defaultPortInfo, uploadTestFile } from '@api/attribution';
import ConfigModal, { ModalProps } from './ConfigModal';
import style from './index.module.css';
import './index.css';
import { configOSPFRoute, configStaticRoute, getOSPFRoute, getStaticRoute, OSPFConfig, StaticConfig } from '@api/attribution';
import { ContCtx } from '../../App';

function AttributionBox() {

  const { fresh, topologyId, deviceId, setFresh } = useAppContext();
  const { content, setContent } = useContext(ContCtx);
  const [config, setConfig] = useState<Router>();
  const [active, setActive] = useState('0');
  const [formData, setFormData] = useState(defaultPortInfo);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalProps>({
    visible: false,
    type: 0,
    initConfig: []
  });
  const [testFile, setTestFile] = useState();

  useEffect(() => {
    // if (topologyId === -1 || deviceId === -1) {
    //   return;
    // }
    (async function () {
      try {
        const res = await getRouterInfo(topologyId, deviceId);
        setConfig(res.data);
      }
      catch (err) {
        setConfig(mockRouter)
      }
    })()
  }, [deviceId, fresh])

  useEffect(() => {
    setConfig(undefined);
  }, [topologyId])

  useEffect(() => {
    if (!config || !config.ports) {
      return;
    }

    const idx = parseInt(active);
    if (idx < 0 || idx > config.ports.length) {
      return;
    }

    setFormData(o => ({ ...o, ...config.ports[idx] }))
  }, [active, config])

  async function handleSubmit() {
    if (
      // topologyId === -1 || deviceId === -1 ||
      !formData.ip || !formData.mask) {
      return;
    }

    try {
      setLoading(true);
      await updatePort(topologyId, deviceId, [formData])
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }

    setFresh();
  }

  const handleOpenConfig = async (type: number) => {
    const api = type === 0 ? getStaticRoute : getOSPFRoute;
        try {
      const res = await api(topologyId, deviceId);
      if (res.code !== 0) {
        return;
      }

      if (type !== 0) {
        res.data = (res.data as OSPFConfig[]).reduce((prev, curr) => prev.concat(curr.networks as any), []);
      }

      setModal({
        visible: true,
        initConfig: res.data,
        type
      })
    }
    catch (err) {
      console.log(err);
    }
  }

  const beforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e: any) => {
      try {
        const json = JSON.parse(e.target.result);
        const res = await uploadTestFile(topologyId, deviceId, json);

        if (res.code !== 0) {
          message.error('测试失败');
          setContent('sijfhwif94h9gfwf49b4ncn49ht294oqfnw ob934394g29bb');
        }

        else {
          message.success('测试成功');
          let str = '';
          //   const res = {data: [{
          //     "output": "Codes: C - connected, S - static, I - IGRP, R - RIP, M - mobile, B - BGP\n       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area\n       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2\n       E1 - OSPF external type 1, E2 - OSPF external type 2, E - EGP\n       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area\n       * - candidate default, U - per-user static route, o - ODR\n       P - periodic downloaded static route\n\nGateway of last resort is not set\n\n     1.0.0.0/24 is subnetted, 1 subnets\nC       1.1.1.0 is directly connected, Loopback0\n     2.0.0.0/24 is subnetted, 1 subnets\nS       2.2.2.0 is directly connected, Serial2/0\n     3.0.0.0/24 is subnetted, 1 subnets\nS       3.3.3.0 [1/0] via 172.17.0.2\nC    172.16.0.0/16 is directly connected, FastEthernet0/0\nC    172.17.0.0/16 is directly connected, Serial2/0\nS    172.18.0.0/16 [1/0] via 172.17.0.2",
          //     "isEqual": true
          //   },
          //   {
          //     "output": "Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 172.17.0.1, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 48/66/86 ms",
          //      "isEqual": true
          //   },
          //   {
          //     "output": "Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 172.18.0.2, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 65/66/68 ms",
          //      "isEqual": true
          //   },
          //   {
          //     "output": "Serial2/0 is up, line protocol is up (connected)\n  Hardware is HD64570\n  Internet address is 172.17.0.1/16",
          //      "isEqual": true
          //   },
          //   {
          //     "output": "Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to 2.2.2.0, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 17/30/48 ms",
          //      "isEqual": true
          //   },
          //   {
          //     "output": "Type escape sequence to abort.\nTracing the route to 3.3.3.0\n\n  1   172.17.0.2      37 msec   48 msec   16 msec   \n  2   172.18.0.2      53 msec   20 msec   69 msec",
          //      "isEqual": true
          //   }
          // ]};
          res.data.forEach(item => {
            str += '\n\n----------------------\n\n';

            str += item.output + '\n';

            str += 'isEqual: ' + item.isEqual + '\n';

          })

          setContent(str);
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    return false;
  }

  return config ? (
    <Spin spinning={loading} wrapperClassName={style.warpper}>
      <div id={style.cont} >
        <h1 style={{ fontSize: '1.3rem', margin: '0' }}>{config.name}</h1>

        <Button onClick={() => handleOpenConfig(0)}>静态路由</Button>
        <Button onClick={() => handleOpenConfig(1)} style={{ marginLeft: '10px' }}>动态路由</Button>
        <Upload fileList={testFile} showUploadList={false} beforeUpload={beforeUpload}>
          <Button style={{ marginLeft: '10px' }} icon={<UploadOutlined />}>测试文件</Button>
        </Upload>
        <ConfigModal modal={modal} close={() => setModal((o) => ({ ...o, visible: false }))} />

        <Card
          tabList={config.ports.map((port, idx) => ({ key: idx + '', tab: port.name }))}
          activeTabKey={active}
          onTabChange={setActive}
        >
          <Tag color={formData.isUp ? "green" : 'gray'}>端口{formData.isUp ? '已' : '未'}开启</Tag>
          <Form style={{ marginTop: '20px' }} labelCol={{ span: 5 }}>
            <Form.Item label='ip地址'>
              <Input value={formData.ip} onChange={e => setFormData(o => ({ ...o, ip: e.target.value }))} />
            </Form.Item>
            <Form.Item label='子网掩码'>
              <Input value={formData.mask} onChange={e => setFormData(o => ({ ...o, mask: e.target.value }))} />
            </Form.Item>
            <Button style={{ display: 'block', margin: '0 auto' }} onClick={handleSubmit}>提交</Button>
          </Form>
        </Card>
      </div>
    </Spin>
  ) : <Empty imageStyle={{ height: '60%', width: '100%' }} />
}

export default AttributionBox;
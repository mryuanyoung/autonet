import { useAppContext } from '@hooks/AppContext';
import { useEffect, useState } from 'react';
import { Card, Empty, Form, Tag, Input, Button, Spin } from 'antd';
import { getRouterInfo, updateRouter, mockRouter, Router, defaultPortInfo } from '@api/attribution';
import style from './index.module.css';
import './index.css';

function AttrubutionBox() {

  const { fresh, topologyId, deviceId, setFresh } = useAppContext();
  const [config, setConfig] = useState<Router>();
  const [active, setActive] = useState('0');
  const [formData, setFormData] = useState(defaultPortInfo);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if(topologyId === -1 || deviceId === -1){
    //   return;
    // }
    // (async function () {
    //   try {
    //     const res = await getRouterInfo(topologyId, deviceId);
    //     setConfig(res.data);
    //   }
    //   catch (err) {
    setConfig(mockRouter)
    //   }
    // })()
  }, [topologyId, deviceId, fresh])

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
      topologyId === -1 || deviceId === -1 ||
      !formData.ip || !formData.mask) {
      return;
    }

    try {
      setLoading(true);
      await updateRouter(topologyId, deviceId, formData)
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);

    }

    setFresh();
  }

  return config ? (
    <Spin spinning={loading} wrapperClassName={style.warpper}>
      <Card
        style={{ height: '100%', width: '100%' }}
        title={config.name}
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
    </Spin>
  ) : <Empty imageStyle={{ height: '100%', width: '100%' }} />
}

export default AttrubutionBox;
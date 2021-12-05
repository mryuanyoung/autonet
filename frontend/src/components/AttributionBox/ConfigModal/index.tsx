import { Modal, Form, Space, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {configOSPFRoute, configStaticRoute} from '@api/attribution';
import {useAppContext} from '@hooks/AppContext';

export interface ModalProps {
  visible: boolean,
  type: number,
}

export interface Props {
  modal: ModalProps,
  close: () => void
}

const Configs = [
  { title: '静态路由配置', fieldKey: 'passBy', msg: '端口不能为空', ph: '端口', api: configStaticRoute },   // 静态路由
  { title: 'OSPF配置', fieldKey: 'area', msg: '区域不能为空', ph: '区域', api: configOSPFRoute }       // ospf
];

const ConfigModal: React.FC<Props> = (props) => {

  const {topologyId, deviceId} = useAppContext();

  const { modal, close } = props;

  const config = Configs[modal.type];

  const onFinish = (values: any) => {
    if(!values || !values.config || values.config.length === 0){
      return close();
    }


    console.log(values.config);
    config.api(topologyId, deviceId, values.config);
    close();
  };

  return (
    <Modal title={config.title} visible={modal.visible} onCancel={close} footer={null} destroyOnClose>
      <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
        <Form.List name="config">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'ip']}
                    fieldKey={[fieldKey, 'ip']}
                    rules={[{ required: true, message: 'ip地址不能为空' }]}
                  >
                    <Input placeholder="IP地址" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'mask']}
                    fieldKey={[fieldKey, 'mask']}
                    rules={[{ required: true, message: '子网掩码不能为空' }]}
                  >
                    <Input placeholder="子网掩码" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, config.fieldKey]}
                    fieldKey={[fieldKey, config.fieldKey]}
                    rules={[{ required: true, message: config.msg }]}
                  >
                    <Input placeholder={config.ph} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button style={{margin: '0 auto', display: 'block'}} type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ConfigModal;
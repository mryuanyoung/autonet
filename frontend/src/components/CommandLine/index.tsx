import { useAppContext } from '@hooks/AppContext';
import { Button } from 'antd';

function CommandLine() {
  const { deviceId, setDeviceId } = useAppContext();

  return (
    <div>命令行 {deviceId} <Button onClick={() => setDeviceId(d => d + 1)}>增加</Button></div>
  )
}

export default CommandLine;
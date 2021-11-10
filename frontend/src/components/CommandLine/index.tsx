import { useAppContext } from '@hooks/AppContext';
import { sendCommandLine } from '@api/command';
import style from './index.module.css';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Input, Button } from 'antd';

function CommandLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { deviceId } = useAppContext();
  const [content, setContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    ref.current!.scrollTo({ top: ref.current!.scrollHeight });
  }, [content])

  const handleEnter = async () => {
    if (!inputValue) return;

    try {
      setLoading(true);
      // const res = await sendCommandLine(deviceId, value);
      // todo 接入后端

      setContent(s => s += inputValue + '\n')
      setInputValue('');
      setLoading(false);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div id={style.container}>
      <div id={style.textInfo} ref={ref}>
        {content}
      </div>
      <div id={style.input}>
        <Input
          prefix="#"
          suffix={<Button type='link' size='small' onClick={() => setContent('')}>清屏</Button>}
          onChange={e => setInputValue(e.target.value)}
          onPressEnter={handleEnter}
          disabled={loading}
          value={inputValue}
        />
      </div>
    </div>
  )
}

export default CommandLine;
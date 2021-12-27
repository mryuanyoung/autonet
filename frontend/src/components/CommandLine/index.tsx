import { useAppContext } from '@hooks/AppContext';
import { sendCommandLine } from '@api/command';
import style from './index.module.css';
import { useState, useRef, useEffect, useLayoutEffect, useContext } from 'react';
import { Input, Button } from 'antd';
import { ContCtx } from '../../App';

const TextInfo = (props: { contents: { output: string, isEqual: boolean, idx: number }[] }) => {

  const InAOut = props.contents.map(item => {
    const splits = item.output.split('\n');
    return {
      input: splits[0],
      output: splits.slice(1).join('\n')
    }
  });

  return (
    <div>
      {props.contents.map((item, idx) => (
        <div key={item.idx}>
          <span style={{ color: 'orange' }}>-------------Test case {item.idx + 1}---------------</span><br /><br />
          <div style={{ color: 'cyan' }}>测试命令: {InAOut[idx].input}</div><br />
          <div>输出: <br />{InAOut[idx].output}</div><br />
          <div style={{ color: item.isEqual ? 'green' : 'red' }}>与预期{item.isEqual ? '相符' : '不符'}!</div>
          <br /><br />
        </div>
      ))}
    </div>
  )
}

function CommandLine() {
  const { content, setContent } = useContext(ContCtx);
  const ref = useRef<HTMLDivElement>(null);
  const { deviceId } = useAppContext();
  const [inputValue, setInputValue] = useState('');

  const [filter, setFilter] = useState(0); // 0-全部  1-成功 2-失败

  useLayoutEffect(() => {
    ref.current!.scrollTo({ top: ref.current!.scrollHeight });
  }, [content, filter])

  const handleEnter = async () => {
    if (!inputValue) return;

    try {
      // const res = await sendCommandLine(deviceId, value);
      // todo 接入后端

      // setContent(s => s += inputValue + '\n')
      // setInputValue('');
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div id={style.container}>
      <div id={style.textInfo} ref={ref}>
        <TextInfo contents={content.filter(item => {
          switch (filter) {
            case 0:
              return item;
            case 1:
              return item.isEqual;
            case 2:
              return !item.isEqual;
            default:
              return item;
          }
        })} />
      </div>
      <div id={style.input}>
        <Input
          prefix="#"
          suffix={
            <>
              <Button type='link' size='small' onClick={() => setFilter(0)}>全部</Button>
              <Button type='link' size='small' onClick={() => setFilter(1)}>已通过</Button>
              <Button type='link' size='small' onClick={() => setFilter(2)}>未通过</Button>
              <Button type='link' size='small' onClick={() => setContent([])}>清屏</Button>
            </>
          }
          onChange={e => setInputValue(e.target.value)}
          onPressEnter={handleEnter}
          // disabled={loading}
          disabled
          value={inputValue}
        />
      </div>
    </div>
  )
}

export default CommandLine;
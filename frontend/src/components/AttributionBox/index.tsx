import { useAppContext } from '@hooks/AppContext';
import { useEffect } from 'react';

function AttrubutionBox() {

  const {fresh} = useAppContext();

  useEffect(() => {
    console.log('需要更新哦')
  }, [fresh]);

  return (
    <div>屬性框</div>
  )
}

export default AttrubutionBox;
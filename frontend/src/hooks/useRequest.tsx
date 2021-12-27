import { useState } from "react";
import { useAppContext } from "./AppContext";

interface Props{
  api: Function
  params: any[]
  errHandle?: Function,
}

const useRequest = (props: Props) => {

  const {api, params, errHandle=() => {}} = props;

  const {loading, setLoading} = useAppContext();
  const [res, setRes] = useState();

  (async function(){
    try{
      if(!loading){
        setLoading(true);
      }
      const res = await api(...params);
      if(res.code === 0){
        setRes(res.data);
      }
    }
    catch(err){
      console.log('出错啦：：：' ,err)
      errHandle();
    }
    finally{
      setLoading(false);
    }
  })();

  return {
    loading,
    res
  }
}

export default useRequest;
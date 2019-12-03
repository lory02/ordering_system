import React ,{useState} from 'react';
import { useHistory , useParams} from 'react-router-dom'
import '../../scss/SelectPage.scss'

function SelectPage() {
  const history = useHistory()
  const {rid} = useParams()
  //扫码获取餐桌号,之后改成动态获取did
  const did = 1
  const [Active,setActive] = useState(null)

  function startOrder(){
    history.push({
      pathname: `/restaurant/${rid}/desk/${did}/customerCount/${Active}/menu`,
      state : rid
    })
    // history.push(`/restaurant/${rid}/desk/${did}/customerCount/${Active}/menu`)
  }

  return(
    <div className='SelectPage'>
      <h3>欢迎光临</h3>
      <p>请选择正确的用餐人数</p>
      <ul>
        {
          new Array(12).fill(0)
            .map((_,idx)=>{
              return <li key={idx} className={`${Active===(idx+1) ? 'active':null}`} onClick={()=>setActive(idx+1)}>{idx+1}</li>
            })
        }
      </ul>
      <button onClick={startOrder}>开始点餐</button>
    </div>
  )
}

export default SelectPage
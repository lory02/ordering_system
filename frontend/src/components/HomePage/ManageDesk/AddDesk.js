import React, {useState} from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import axios from '../../../api'
import '../../../scss/AddDesks.scss' 

function AddDesk (props) {
  const {rid} = useRouteMatch().params
  const dispatch =  props.addDesk

  const [deskInfo, setDeskInfo] = useState({
    name: '',
    capacity: ''
  })

  function handleChange (e) {
    setDeskInfo({
      ...deskInfo,
      [e.target.name]: e.target.value
    })
  }

  function submit(e) {
    e.preventDefault();

    axios.post('/restaurant/'+rid+'/desks',deskInfo)
      .then(res=>{
        dispatch({type: 'addDesk', newDesk: res.data})
      })
  }

  return (
    <div className='AddDesk'>
      <form onSubmit={submit}>
      <div>桌号: <input type='text' name='name' onChange={handleChange} defaultValue={deskInfo.name} /></div>
      <div>容量: <input type='text' name='capacity' onChange={handleChange} defaultValue={deskInfo.capacity} /></div>
      <button>提交</button>
      </form>
    </div>
  )
}

export default AddDesk
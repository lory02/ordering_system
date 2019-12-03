import React, {useState} from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import axios from '../../../api'
import '../../../scss/AddFood.scss'


function AddFood (props) {
  const {rid} = useRouteMatch().params
  const dispatch =  props.addFood

  const [foodInfo, setFoodInfo] = useState({
    name: '',
    desc: '',
    price: '',
    category: '',
    status: 'on',
    img: null
  })

  function handleChange (e) {
    e.target.name === 'img' ?
      setFoodInfo({
        ...foodInfo,
        img: e.target.files[0]  // 图片信息
      })
    :
      setFoodInfo({
        ...foodInfo,
        [e.target.name]: e.target.value
      })
  }

  function submit(e) {
    e.preventDefault();
    let fd = new FormData()
    for( var key in foodInfo) {
      fd.append(key, foodInfo[key])
    }
    axios.post('/restaurant/'+rid+'/foods',fd)
      .then(res=>{
        dispatch({type: 'addFood', newFood: res.data})
      })
  }

  function textareaChange(e) {
    setFoodInfo({
      ...foodInfo,
      desc: e.target.value
    })
  }

  return (
    <div className='AddFood'>
      <form onSubmit={submit}>
      <div>名称<input type='text' name='name' onChange={handleChange} defaultValue={foodInfo.name} /></div>
      <div>分类<input type='text' name='category' onChange={handleChange} defaultValue={foodInfo.category} /></div>
      <div>价格<input type='text' name='price' onChange={handleChange} defaultValue={foodInfo.price} /></div>
      <div>图片<a>点击上传图片<input type='file' name='img' onChange={handleChange} defaultValue={foodInfo.img} /></a></div>
      <div>描述<textarea defaultValue={foodInfo.desc} onChange={textareaChange}></textarea></div>
      <button>提交</button>
      </form>
    </div>
  )
}

export default AddFood

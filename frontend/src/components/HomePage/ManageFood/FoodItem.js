import React, { useState , useReducer } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import axios from '../../../api'
import { Card, Icon, Avatar } from 'antd';
import '../../../scss/FoodItem.scss'


function init(food) {
  return {
    isModified: false,
    foodInfo: food
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'changeFood' :
      return {...state, isModified: false, foodInfo: action.data };
    case 'changeStatus':
      return {...state, isModified: false, foodInfo: {...state.foodInfo, status: action.status}}
    case 'modify' :
      return {...state, isModified: true };
    case 'close' :
      return {...state, isModified: false };
    default:
      throw new Error()
  }
}

function FoodItem({deleteFood, food}){
  const {rid} = useRouteMatch().params
  const [state, dispatch] = useReducer(reducer, food, init)
  const foodInfo = state.foodInfo

  var [foodProps, setFoodProps] = useState({
    name: foodInfo.name,
    desc: foodInfo.desc,
    price: foodInfo.price,
    category: foodInfo.category,
    status: foodInfo.status,
    img:null,
  })

  function handleChange(e){
    e.target.name === 'img' ?
      setFoodProps({
        ...foodProps,
        img: e.target.files[0]
      })
    :
      setFoodProps({
        ...foodProps,
        [e.target.name]: e.target.value
      })
  }

  function textareaChange(e) {
    setFoodProps({
      ...foodProps,
      desc: e.target.value
    })
  }

  // 修改菜品
  function changeData(type){
    const fd = new FormData()
    for(var key in foodProps) {
      if(type === 'changeStatus') {
        key === 'status' ?
          fd.append(key, foodProps.status === 'on' ? 'off' : 'on')
        :
          fd.append(key, foodProps[key])
      } else {
        fd.append(key, foodProps[key])
      }
    }
    axios.put(`/restaurant/${rid}/foods/${foodInfo.id}`,fd)
      .then(res=>{
        type === 'changeFood' ?
          dispatch({type: 'changeFood', data: res.data})
        :
          dispatch({type: 'changeStatus', status: foodInfo.status === 'on' ? 'off' : 'on'})

        setFoodProps({
          name: res.data.name,
          desc: res.data.desc,
          price: res.data.price,
          category: res.data.category,
          status: res.data.status,
          img:null,
        })
      })  
  }

  // 修改内容
  function submit (e) {
    e.preventDefault();
    changeData('changeFood')
  }

  // 上架or下架
  function changeStatus() {
    changeData('changeStatus')
  }

  // 删除菜品
  function deleteItem(id) {
    axios.delete(`/restaurant/${rid}/foods/${foodInfo.id}`)
      .then(res=>{
          deleteFood({type: 'deleteFood', id: id})
        })
  }

  return (
    <div>
      {
        state.isModified &&
          (
            <>
              <div className='Masking' onClick={()=>{dispatch({type:'close'})}}></div>
              <div className={'OrderDetails'+' '+'changeFood'}>
              {/* 样式做成弹窗 */}
                <form onSubmit={submit}>
                  <div>名称：<input type='text' onChange={handleChange} defaultValue={foodInfo.name} name="name"/></div>
                  <div>价格：<input type='text' onChange={handleChange} defaultValue={foodInfo.price} name="price"/></div>
                  <div>分类：<input type='text' onChange={handleChange} defaultValue={foodInfo.category} name="category"/></div>
                  <div>图片：<a>上传图片<input type='file' onChange={handleChange} name='img' /></a></div>
                  <div>描述</div>
                  <div className='textareaWrapper'><textarea defaultValue={foodInfo.desc} onChange={textareaChange}></textarea></div>
                  <button>保存</button>
                </form>
              </div>
            </>
          )
      }
      {
        <div className='foodCard'>
          <Card
            style={{ width: 210 }}
            cover={
              <img
                alt={foodInfo.name}
                src={'http://localhost:5000/uploads/' + foodInfo.img}
              />
            }
            actions={[
              <div onClick={()=>{dispatch({ type: 'modify'})}}>修改</div>,
              <div onClick={changeStatus}>
                {foodInfo.status === 'on' ? '下架' : '上架'}
              </div>,
              <div onClick={() => deleteItem(foodInfo.id)}>删除</div>,
            ]}
          >
          <div className='description'>
            <span>{foodInfo.name}</span>
            <span><span>￥&nbsp;</span>{foodInfo.price}</span>
          </div>
          </Card>
          </div>
      }
    </div>
  )
}

export default FoodItem

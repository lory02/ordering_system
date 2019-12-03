import React, { useReducer, useEffect, useState } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import axios from '../../../api'
import AddDesk from './AddDesk.js'
import { Table, Divider } from 'antd';
import { Button } from 'antd';


// useReducer : 组件内的redux
const initialState = {
  isModified: false,
  isAdd : false,
  isLoading: true,
  data: ''
};

function reducer ( state, action) {
  switch (action.type) {
    case 'isAdd': 
      return {...state, isAdd: true}
    case 'addDesk': 
      return {...state, isAdd: false, data: [...state.data,action.newDesk] }
    case 'deleteDesk':
      const desks = state.data.filter(desk => desk.id !== action.id)
      return {...state, data: desks}
    case 'setDesks':
      return  {...state, data: action.data, isLoading: false} 
    case 'back':
      return {...state, isAdd: false}
    case 'modify' :
      if(action.value === false) return  {...state, isModified: false }
      return {...state, isModified: true };
    case 'changeDesk' :
      const data = state.data.filter(desk=> desk.id !== action.data.id)
      return {...state, isModified: false, data: [...data, action.data] };
    default:
        throw new Error();
  }
}

function ManageDesks () {
  const {rid} = useRouteMatch().params
  const [state, dispatch] = useReducer(reducer, initialState)
  const [deskProps, setDeskProps] = useState(null)

  // 初次加载数据
  useEffect(() => {
    axios.get('/restaurant/'+rid+'/desks')
      .then(res=>{
        dispatch({type: 'setDesks', data: res.data})
      })
  }, [rid])

  // ant-design 表头
  const columns = [
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
      render: text => <a>{text}</a>,
    },
    {
      title: '桌号',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '容量',
      dataIndex: 'capacity',
      key: 'capacity',
      render: text => <a>{text}</a>,
    },
  
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        console.log(text,record)
        return(
          <span>
            <a onClick={() => changeDesk(record.key,record.name,record.capacity)} >修改</a>
            <Divider type="vertical" />
            <a onClick={() => deleteItem(record.key)} >删除</a>
          </span>
        )
        },
    },
  ];

  // ant-design 表格数据
  const data = []
  if(state.data) {
    state.data.forEach((desk,idx) => {
      data.push({
        number: idx+1,
        key: desk.id,
        name: desk.name,
        capacity: desk.capacity
      })
    })
  }

  // 修改桌子
  function changeDesk(id, name, capacity) {
    setDeskProps({
      id: id,
      name: name,
      capacity: capacity,
    })
    dispatch({type:'modify'})
  }

  // 存储input数据
  function handleChange(e){
    setDeskProps({
      ...deskProps,
      [e.target.name]: e.target.value
    })
  }

  // 提交修改数据
  function submit (e) {
    e.preventDefault();    
    
    axios.put(`/restaurant/${rid}/desks/${deskProps.id}`,deskProps)
      .then(res=>{
          dispatch({type: 'changeDesk', data: res.data})

          setDeskProps({
            id: res.data.id,
            name: res.data.name,
            capacity: res.data.capacity,
          })
      })  
  }

  // 删除桌子
  function deleteItem(id) {
    axios.delete(`/restaurant/${rid}/desks/${id}`)
      .then(res=>{
          dispatch({type: 'deleteDesk', id: id})
        })
  }

  return (
    <div>
    {
      state.isLoading ?
        <div>...loading</div>
      : 
        <div>
          {
            state.isModified?
            (
              <div>
                <Button onClick={ ()=> dispatch({type: 'modify', value: false}) }>返回</Button>
                <div>
                  <form onSubmit={submit}>
                    桌号: <input type='text' onChange={handleChange} defaultValue={deskProps.name} name="name"/>
                    容量：<input type='text' onChange={handleChange} defaultValue={deskProps.capacity} name="capacity"/>
                    <button>保存</button>
                  </form>
                </div>
              </div>
            )
            :
            <div>
              <Button onClick={ ()=> !state.isAdd ? dispatch({type: 'isAdd'}) : dispatch({type: 'back'}) }>{state.isAdd ? '返回' : '添加桌子'}</Button>
              {
                state.isAdd ?
                  <AddDesk addDesk={dispatch}></AddDesk>
                :
                <Table columns={columns} dataSource={data} />
              }
            </div>
          }
        </div>
    }
    </div>
  )
}

export default ManageDesks


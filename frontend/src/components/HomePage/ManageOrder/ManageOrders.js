import React, { useReducer, useEffect, useState} from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import axios from '../../../api'
import { Table, Divider } from 'antd';
import OrderDetails from './OrderDetails'
import '../../../scss/ManageOrders.scss'

const initialState = {
  isView: false,
  isLoading: true,
  data: ''
};

function reducer ( state, action) {
  switch (action.type) {
    case 'setOrders':
      return  {...state, data: action.data, isLoading: false} ;
    case 'view' :
      return {...state, isView: true };
    case 'changeOrder' :
      const newData = state.data.filter(order=> order.id !== action.id)
      return {...state, data: [...newData, action.order]};
    case 'deleteOrder':
      const orders = state.data.filter(order => order.id !== action.id)
      return {...state, data: orders}
    case 'close' :
        return {...state, isView: false };
    default:
        throw new Error();
  }
}

function ManageOrders () {
  const {rid} = useRouteMatch().params
  const [state, dispatch] = useReducer(reducer, initialState)
  const [OrderInfo,setOrderInfo] = useState(null)

  useEffect(() => {
    axios.get('/restaurant/'+rid+'/orders')
      .then(res=>{
        dispatch({type: 'setOrders', data: res.data})
      })
  }, [rid])
  

  let data = []
  if(state.data) {
    state.data.forEach((order,idx)=>{
      data.push({
        key: order.id,
        number: idx + 1,
        deskName: order.deskName,
        customerCount: order.customerCount,
        totalPrice: order.totalPrice,
        status: order.status,
        details: order.details
      })
    })
  }

  const columns = [
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
      render: text => <a>{text}</a>,
    },
    {
      title: '桌号',
      dataIndex: 'deskName',
      key: 'deskName',
      render: text => <a>{text}</a>,
    },
    {
      title: '人数',
      dataIndex: 'customerCount',
      key: 'customerCount',
      render: text => <a>{text}</a>,
    },
    {
      title: '合计',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: text => <a>{text}</a>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text =>{
       return  <a>{getStatus(text)}</a>
      } ,
        
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          {record.status !=='completed' && <a onClick={()=>{changeStatus(record.status, record.key)}}>{getAction(record.status)}</a>}
          {record.status !=='completed' && <Divider type="vertical" />}
          <a onClick={() => {seeDetails(record.details, record.totalPrice)}}>订单详情</a>
          <Divider type="vertical" />
          <a onClick={() => deleteItem(record.key)} >删除</a>
        </span>
      ),
    },
  ];

  function getStatus(status) {
    switch (status) {
      case 'pending':
        return '待确定'
        break;
      case 'confirmed':
        return '待付款'
        break;
      case 'completed':
        return '已付款'
        break;
    }
  }

  function getAction(status) {
    switch (status) {
      case 'pending':
        return '确认订单'
        break;
      case 'confirmed':
        return '确认付款'
        break;
    }
  }

  // 确认订单
  function changeStatus(status,id) {
    if(status === 'pending') {
      status = 'confirmed'
    } else if (status==='confirmed') {
      status = 'completed'
    }
    axios.put(`/restaurant/${rid}/orders/${id}/status`,{status: status})
      .then(res=>{
        dispatch({type:'changeOrder',order:res.data, id: id})
      })
  }

  // 查看详情
  function seeDetails(details, totalPrice){
    setOrderInfo({
      details:details,
      totalPrice: totalPrice
    })
    dispatch({ type: 'view'})
  }

  // 删除
  function deleteItem(id) {
    axios.delete(`/restaurant/${rid}/orders/${id}`)
      .then(res=>{
          dispatch({type: 'deleteOrder', id: id})
        })
  }



  return (
    <div>
      {
        state.isLoading ?
        <div>...loading</div>
        : 
        <div>
          {state.isView && <div className='Masking' onClick={()=>dispatch({type:'close'}) }></div>}
          <div>
            {
              state.isView && <OrderDetails details = {OrderInfo.details} totalPrice = {OrderInfo.totalPrice}></OrderDetails>
            }
          </div>
          <Table columns={columns} dataSource={data} />
        </div>
      }
    </div>
  )
}

export default ManageOrders

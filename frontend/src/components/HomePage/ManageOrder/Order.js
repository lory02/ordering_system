import React, { useReducer } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import axios from '../../../api'
import OrderDetails from './OrderDetails'

function init(order) {
  return {
    isView: false,
    orderInfo: order
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'changeStatus' :
      return {...state, isView: false, orderInfo: {...state.orderInfo,status:action.status} };
    case 'view' :
      return {...state, isView: true };
    default:
      throw new Error()
  }
}

function Order({deleteOrder, order}){
  const {rid} = useRouteMatch().params
  const [state, dispatch] = useReducer(reducer, order, init)
  const orderInfo = state.orderInfo

  // 删除
  function deleteItem(id) {
    axios.delete(`/restaurant/${rid}/orders/${orderInfo.id}`)
      .then(res=>{
          deleteOrder({type: 'deleteOrder', id: id})
        })
  }

  // 修改状态
  function changeStatus() {
    let status = orderInfo.status
    if(status === 'pending') {
      status = 'confirmed'
    } else if (status==='confirmed') {
      status = 'completed'
    }

    axios.put(`/restaurant/${rid}/orders/${orderInfo.id}/status`,status)
      .then(res=>{
        dispatch({type:'changeStatus',status:status})
      })
  }

  function getStatus() {
    switch (orderInfo.status) {
      case 'pending':
        return '待确定'
        break;
      case 'confirmed':
        return '待付款'
        break;
      case 'confirmed':
        return '已付款'
        break;
    }
  }

  function getAction() {
    switch (orderInfo.status) {
      case 'pending':
        return '确认订单'
        break;
      case 'confirmed':
        return '确认付款'
        break;
    }
  }

  return (     
    <div>
      <div>
          {
            state.isView && <OrderDetails details = {orderInfo.details} totalPrice = {orderInfo.totalPrice}></OrderDetails>
          }
      </div>
      <p>桌号：{orderInfo.deskName}</p>
      <p>人数：{orderInfo.customerCount}</p>
      <p>合计：{orderInfo.totalPrice} 元</p>
      <p>状态：{getStatus()}</p>
      <div>
        {orderInfo.status!=='confirmed' && <button onClick={changeStatus}>{getAction()}</button>}
        <button onClick={()=>{dispatch({ type: 'view'})}}>订单详情</button>
        <button onClick={() => deleteItem(orderInfo.id)}>删除</button>
      </div>
    </div>
  )
}

export default Order
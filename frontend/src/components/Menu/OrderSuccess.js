import React from 'react'
import '../../scss/OrderSuccess.scss'


function OrderSuccess(props) {
console.log(props.location.state)

  return (
    <div className='OrderSuccess'>
        <div><span>✅</span></div>
        <p>下单成功</p>
        <p>请认真等待餐厅确认</p>
    </div>
  )
}

export default OrderSuccess
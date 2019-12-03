import React, { useState } from 'react'
import '../../../scss/OrderDetails.scss'


function OrderDetails({details,totalPrice}) {
  console.log(details)
  return (
    <div className='OrderDetails'>
      <table>
        <tbody>
          <tr>
            <th>编号</th>
            <th>图片</th>
            <th>菜名</th>
            <th>数量</th>
            <th>单价</th>
          </tr>
          {
            details.map((detail,idx)=>{
              return (
                <tr key={idx}>
                  <td>{idx+1}</td>
                  <td><img src={'http://localhost:5000/uploads/' + detail.food.img} alt={detail.food.name}></img></td>
                  <td>{detail.food.name}</td>
                  <td>{detail.amount}</td>
                  <td>￥{detail.food.price}</td>
                </tr>
              )
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td>合计：{totalPrice}元</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default OrderDetails;
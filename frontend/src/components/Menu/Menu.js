import React, {Component, useState } from 'react'
import axios from '../../api'
import { produce } from 'immer'
import io from 'socket.io-client'
import '../../scss/Menu.scss'
import MenuItem from './MenuItem'
import { createHashHistory } from 'history'

const history = createHashHistory()

export default class FoodCart extends Component{
  constructor(props) {
    console.log(props.location.state)
    super(props)
    this.state = {
      cart:[],
      deskInfo:{},
      foodMenu:[], 
    }
  }

  componentDidMount(){
    var params = this.props.match.params

    axios.get('/deskInfo?did=' + params.did).then(res=>{
      this.setState({
        deskInfo: res.data
      })
    })

    axios.get(`/menu/restaurant/${this.props.location.state}`).then(res=>{
      this.setState({
        foodMenu:res.data
      })
    })

    //socket连接根目录
    this.socket = io('ws://localhost:5000/')

    this.socket.emit('join desk', 'desk:' + params.did)

    this.socket.on('cart food', info => {
      this.setState(produce(state=>{
        state.cart.push(...info)
      }))
    })

    this.socket.on('new food', info=>{
      this.foodChange(info.food, info.amount)
    })

    this.socket.on('placeOrder success',order=>{
      history.push({
        pathname:`/restaurant/${params.rid}/desk/${params.did}/order-success`,
        state: order
      })
    })  
  }

  componentWillUnmount(){
    this.socket.close()
  }

  cartChange = (food,amount) => { 
    var params = this.props.match.params
    this.socket.emit('new food',{desk:'desk:'+params.did,food,amount})
  }

  foodChange= (food, amount) =>{
    var cart = this.state.cart
    var updatedCart = produce(cart, (cart)=>{
      var idx = cart.findIndex(it => it.food.id === food.id)

      if (idx >= 0) {
        if (amount === 0) {
          cart.splice(idx, 1)
        } else {
          cart[idx].amount = amount
        }
      } else {
        cart.push({
          food,
          amount,
        })
      }
    })
    this.setState({
      cart: updatedCart
    })
  }

  placeOrder = () => {
    console.log(112)
    var params = this.props.match.params
    axios.post(`/restaurant/${params.rid}/desk/${params.did}/order`,{
      deskName:this.state.deskInfo.name,
      customerCount:params.number,
      totalPrice:calcTotalPrice(this.state.cart),
      foods: this.state.cart,
    }).then(res=>{
      console.log(res.data)
      history.push({
        pathname:`/restaurant/${params.rid}/desk/${params.did}/order-success`,
        state:res.data
      })
    })

  }

  render() {
    return (
      <div>
        <div>
          {
            this.state.foodMenu.map(food=>{
              var currFoodCartItem = this.state.cart.find(it => it.food.id === food.id)
              var currentAmount = currFoodCartItem ? currFoodCartItem.amount : 0
              return <MenuItem food={food} key={food.id} amount={currentAmount} onUpdate={ this.cartChange }></MenuItem>
            })
          }
        </div>
          <CartStatus foods={this.state.cart} onUpdate={this.cartChange} onPlaceOrder={this.placeOrder} />
      </div>
    )
  }
}


function calcTotalPrice(cartAry) {
  return cartAry.reduce((total, item)=>{
    return total + item.amount * item.food.price
  },0)
}

function CartStatus({foods, onUpdate, onPlaceOrder}) {
  var [expand, setExpand] = useState(false)

  var totalPrice = calcTotalPrice(foods)

  function dec(food,amount) {
    if(amount > 0) {
      onUpdate(food, amount -1)
    }
  }
  
  function inc(food,amount) {
    onUpdate(food, amount + 1)
  }

  return (
    <div className='Menu'>
    <div>
      <div className = 'CartStatus'>
        {
          foods && 
          <>
            {
              expand &&
                <ul className='CartList'>                   
                {
                  foods.map(foodInfo=>{
                    const food = foodInfo.food
                    return (
                      foodInfo.amount >0 &&
                      <li key={food.id}>
                        <div>
                          <img src={'http://localhost:5000/uploads/' + food.img} alt ={food.name} />  
                        </div>
                        <div className='foodInfo'>
                          <p>{ food.name }</p>
                          <p>￥{ food.price }元</p>
                        </div>
                        <div>
                          <button onClick={()=>dec(food, foodInfo.amount)}>-</button>
                            <span>{foodInfo.amount }</span>
                          <button onClick={()=>inc(food,foodInfo.amount)}>+</button>
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            }
          </>
        }
        <div className='cartOperation' >
          <div>
            <strong>总价：<span>{totalPrice }</span>元 </strong>
            <button onClick={()=> onPlaceOrder()}>确定下单</button>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  )
}


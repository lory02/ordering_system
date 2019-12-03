import React from 'react'
import PropTypes from 'prop-types'
import '../../scss/MenuItem.scss'

function MenuItem({food, onUpdate ,amount}) {
  function dec() {
    if(amount > 0) {
      onUpdate(food, amount -1)
    }
  }
  
  function inc() {
    onUpdate(food, amount + 1)
  }

  return (
    <div className='MenuItem'>
      <div>
        <img src={'http://localhost:5000/uploads/' + food.img} alt ={food.name} />
      </div>
      <div className='ItemInfo'>
        <p>{ food.name }</p>
        <p className='itemPrice'>￥{ food.price }</p>
      </div>
      <div>
        <button onClick={dec}>-</button>
        <span>{ amount }</span>
        <button onClick={inc}>+</button>
      </div>
    </div>
  )
}

MenuItem.propTypes = {
  food: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
} 

MenuItem.defaultProps = {
  onUpdate: () => {},
}

export default MenuItem
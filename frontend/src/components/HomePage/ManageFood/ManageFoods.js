import React, { useReducer, useEffect} from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import axios from '../../../api'
import AddFood from './AddFood'
import FoodItem from './FoodItem'
import { Button } from 'antd';
import '../../../scss/ManageFoods.scss'

// useReducer : 组件内的redux
const initialState = {
  isAdd : false,
  isLoading: true,
  data: ''
};

function reducer ( state, action) {
  switch (action.type) {
    case 'isAdd': 
      return {...state, isAdd: true}
    case 'addFood': 
      return {...state, isAdd: false, data: [...state.data,action.newFood] }                                 
    case 'deleteFood':
      const foods = state.data.filter(food => food.id !== action.id)
      return {...state, data: foods}
    case 'setFoods':
      return  {...state, data: action.data, isLoading: false} 
    case 'back':
      return {...state, isAdd: false}
    default:
        throw new Error();
  }
}

function ManageFoods () {
  const {rid} = useRouteMatch().params
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    axios.get('/restaurant/'+rid+'/foods')
      .then(res=>{
        dispatch({type: 'setFoods', data: res.data})
      })
  }, [rid])
    
  return (
    <div>
    {
      state.isLoading ?
        <div>...loading</div>
      : 
        <div>
          <Button onClick={ ()=> !state.isAdd ? dispatch({type: 'isAdd'}) : dispatch({type: 'back'}) }>{state.isAdd ? '返回' : '添加菜品'}</Button>
          {
            state.isAdd ?
              <AddFood addFood={dispatch}></AddFood>
            :
            (<div className='FoodItems'>
              {
                state.data.map(food => {
                  return <FoodItem deleteFood={dispatch} food={food} key={food.id} />
                })
              }
            </div>)
          }
        </div>
    }
    </div>
  )
}

export default ManageFoods
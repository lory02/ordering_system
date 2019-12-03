import { useEffect } from 'react'
import {
  useHistory,
} from "react-router-dom"
import axios from '../api'

function CheckLogin () {
  const history = useHistory()
  console.log('checklogin')
  useEffect(() => {
    axios.get('/')
      .then(res=>{
        res.data.code ?
          history.push(`/restaurant/${res.data.userId}/homepage/`)
          :
          history.push('/login')
      })
  }, [history])

  return null;
}

export default CheckLogin
import React,{ useState ,useEffect} from 'react'
import {
  Switch,
  Route,
  Link,
  useRouteMatch
} from 'react-router-dom'
import ManageFoods from './ManageFood/ManageFoods.js'
import ManageDesks from './ManageDesk/ManageDesks.js'
import ManageOrders from './ManageOrder/ManageOrders.js'
import { Layout, Menu, Breadcrumb } from 'antd';
import { createHashHistory } from 'history'
import { Button } from 'antd';
import '../../scss/HomePage.scss'
import axios from '../../api'

const { Header, Content, Footer } = Layout;

const history = createHashHistory()

function HomePage () {
  const {path, url ,params} = useRouteMatch()
  const [currentPage,setCurrentPage] = useState('主页')
  useEffect(() => {
    history.push(`/restaurant/${params.rid}/homepage/manageFoods`)
  }, [])

  function handleClick(type) {
    setCurrentPage(type)
  }

  function handleChange() {
    console.log('quit')
    axios.get('/quit')
      .then((res)=>{
        console.log(res.data.msg)
        console.log('quit success')
        history.push('/') 
      })
  }

  return (
    <div className='HomePage'>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1"><Link to={`${url}/manageFoods`} onClick={()=>handleClick('菜谱管理')}>菜谱管理</Link></Menu.Item>
            <Menu.Item key="2"><Link to={`${url}/manageDesks`} onClick={()=>handleClick('餐桌管理')}>餐桌管理</Link></Menu.Item>
            <Menu.Item key="3"><Link to={`${url}/manageOrders`} onClick={()=>handleClick('订单管理')}>订单管理</Link></Menu.Item>
            <span key='4' className='Quit' onClick={handleChange}>退出</span>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>主页</Breadcrumb.Item>
            <Breadcrumb.Item>{currentPage}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Switch>
              <Route 
                path = {`${path}/manageFoods`}
                component={ManageFoods}
              />
              <Route 
                path = {`${path}/manageDesks`}
                component={ManageDesks}
              />
              <Route 
                path = {`${path}/manageOrders`}
                component={ManageOrders}
              />
          </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </div>  
  )
}

export default HomePage
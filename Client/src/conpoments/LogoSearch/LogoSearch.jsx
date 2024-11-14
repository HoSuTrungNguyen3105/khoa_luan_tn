import React from 'react'
import logo from '../../img/logo.png'
import {UilSearch} from '@iconscout/react-unicons'
import './LogoSearch.css'
const LogoSearch = () => {
  return (
    <div className="LogoSearch">
        <img src={logo} alt=""/>
        <div className="Search">
            <input type="text" placeholder='Tìm Kiếm'/>
            <div className='S-icon'>
                <UilSearch/>
            </div>
        </div>
    </div>
  )
}

export default LogoSearch
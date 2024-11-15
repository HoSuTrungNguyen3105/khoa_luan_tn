import React from 'react'
import LogoSearch from '../LogoSearch/LogoSearch'
import ProfileCard from '../ProfileCard/ProfileCard'
import "./ProfileSide.css"
import FollowerCard from '../FollowerCard/FollowerCard'

const ProfileSide = () => {
  return (
    <div className='ProfileSide'>
        <LogoSearch/>
        <ProfileCard/>
        <FollowerCard/>
    </div>
  )
}

export default ProfileSide
import React from 'react'
import InfoCard from '../InfoCard/InfoCard'
import LogoSearch from '../LogoSearch/LogoSearch'
import FollowerCard from '../FollowerCard/FollowerCard'
const ProfileLeft = () => {
  return (
   <div className="ProfileSide">
       <LogoSearch/>
       <InfoCard/>
       <FollowerCard/>
   </div>
  )
}

export default ProfileLeft
import React from 'react'
import Cover from '../../img/cover.jpg'
import Profile from '../../img/profileImg.jpg'
import './ProfileCard.css'
const ProfileCard = () => {
    return (
        <div className="ProfileCard">
            <div className="ProfileImg">
                <img src={Cover} alt='' />
                <img src={Profile} alt='' />
            </div>
            <div className="ProfileName">
                <span>Nguyễn Văn Trung</span>
                <span>Inten Coder</span>
            </div>
            <div className="FollowStatus">
                <hr />
                <div>
                    <div className="Follow">
                        <span>5</span>
                        <span>Người theo dõi</span>
                    </div>
                    <div className="I"></div>
                    <div className="Follow">
                        <span>1</span>
                        <span>Người theo dõi</span>
                    </div>
                </div>
                <hr />
            </div>
            <span>
                Trang cá nhân
            </span>
        </div>
    )
}

export default ProfileCard
import React, { useState, useRef } from 'react'
import ProfileImage from "../../img/profileImg.jpg"
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";

const PostShare = () => {
    const [image, setImage] = useState(null);
    const imageRef = useRef();
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage({
                image: URL.createObjectURL(img),
            });
        }
    };
    return (
        <div className="PostShare">
      <img src={ProfileImage} alt="" />
      <div>
        <input type="text" placeholder="Bạn đang nghĩ gì?" />
        <div className="postOptions">
          <div className="option" style={{ color: "var(--photo)" }}
          onClick={()=>imageRef.current.click()}
          >
            <UilScenery />
            Ảnh
          </div>
          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video{" "}
          </div>
          <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Vị trí
          </div>
          <button className="button ps-button">Đăng bài</button>
          <div style={{ display: "none" }}>
            <input
              type="file"
              name="myImage"
              ref={imageRef}
              onChange={onImageChange}
            />
          </div>
        </div>
      {image && (
        <div className="previewImage">
          <UilTimes onClick={()=>setImage(null)}/>
          <img src={image.image} alt="" />
        </div>

      )}
      </div>
    </div>
    )
}

export default PostShare
import React from "react";
import ProfileSide from "../ProfileSide/ProfileSide";
import RightSide from "../RightSide/RightSide";
import SearchDetail from "../Post/SearchDetail";
import "../ProfileSide/ProfileSide.css";

const SearchPage = () => {
  return (
    <div className="SearchPage">
      <ProfileSide />
      <SearchDetail />
      <RightSide />
    </div>
  );
};

export default SearchPage;

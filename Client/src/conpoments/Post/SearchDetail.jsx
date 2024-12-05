import React from "react";
import { useSearchStore } from "../../store/useSearchStore";
import Post from "./Post";
import "../PostSide/PostSide.css";

const SearchDetail = () => {
  const { results } = useSearchStore(); // Lấy kết quả tìm kiếm từ store

  return (
    <div className="SearchResults">
      <h1>Kết quả tìm kiếm</h1>
      {results.length > 0 ? (
        results.map((post) => (
          <Post key={post._id} data={post} currentUserId={post.currentUserId} />
        ))
      ) : (
        <p>Không tìm thấy kết quả phù hợp</p>
      )}
    </div>
  );
};

export default SearchDetail;

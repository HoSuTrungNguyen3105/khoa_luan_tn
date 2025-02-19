import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const ContractFinder = () => {
  const { finderId } = useParams(); // Lấy ID của Finder từ URL

  const [contracts, setContracts] = useState([]);
  const fetchContractsForFinder = async (finderId) => {
    try {
      const response = await axiosInstance.get(`/user/finder/${finderId}`);
      console.log("Danh sách hợp đồng:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy hợp đồng:", error);
      return null;
    }
  };
  useEffect(() => {
    const loadContracts = async () => {
      const data = await fetchContractsForFinder(finderId);
      if (data?.status === "success") {
        setContracts(data.data);
      }
    };

    loadContracts();
  }, [finderId]);
  const updateContractStatus = async (contractId, newStatus) => {
    try {
      const response = await axiosInstance.put(
        `/user/contracts/${contractId}/status`,
        { status: newStatus }
      );
      console.log("Cập nhật thành công:", response.data);

      // Cập nhật lại danh sách hợp đồng sau khi thay đổi trạng thái
      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract._id === contractId
            ? { ...contract, status: newStatus }
            : contract
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hợp đồng:", error);
    }
  };

  return (
    <div>
      <h2>Hợp đồng của bạn</h2>
      {contracts.map((contract) => (
        <div key={contract._id}>
          <p>Bài đăng số 1: {contract.postId?.desc}</p>
          <p>Người mất: {contract.loser.userId?.username}</p>
          {/* {contract.image.map((images, index) => (
            <div key={index} className="relative group">
              <img
                src={images}
                alt={`selected-${index}`}
                className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-white"
              />
            </div>
          ))} */}
          <p>Trạng thái: {contract.status}</p>
          <button
            onClick={() => updateContractStatus(contract._id, "confirmed")}
          >
            Chấp nhận
          </button>
          <button
            onClick={() => updateContractStatus(contract._id, "rejected")}
          >
            Từ chối
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContractFinder;

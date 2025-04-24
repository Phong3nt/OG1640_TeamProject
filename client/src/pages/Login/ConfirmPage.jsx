import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";

const ConfirmPage = () => {
  const { id } = useParams(); // lấy userId từ URL
  const [message, setMessage] = useState("Đang xác nhận...");

  useEffect(() => {
    const confirm = async () => {
      try {
        await axios.get(`http://localhost:5000/api/users/confirm/${id}`);
        setMessage("Kích hoạt thành công! Bạn có thể đăng nhập.");
      } catch {
        setMessage("Liên kết không hợp lệ hoặc đã hết hạn.");
      }
    };
    confirm();
  }, [id]);

  return (
    <div className="confirm-container">
      <h2>{message}</h2>
      {message.startsWith("Kích") && <Link to="/login">Đăng nhập</Link>}
    </div>
  );
};

export default ConfirmPage;

// import React, { useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import axios from "axios";

// const Logout = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const logoutUser = async () => {
//       try {
//         await axios.post("http://127.0.0.1:8000/api/auth/logout");
//         // بعد تسجيل الخروج، يمكن أن تحذف المعلومات من localStorage
//         localStorage.clear();
//         // إعادة توجيه المستخدم إلى الصفحة الرئيسية أو صفحة تسجيل الدخول
//         navigate.push("/login"); // أو '/' إذا كنت تريد العودة إلى الصفحة الرئيسية
//       } catch (error) {
//         console.error("Logout failed:", error);
//       }
//     };

//     logoutUser();
//   }, [navigate]);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <h1>Logging out...</h1>
//     </div>
//   );
// };

// export default Logout;

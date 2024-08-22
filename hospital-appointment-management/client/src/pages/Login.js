
import { Form, Input, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background1.jpg";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Account Blocked");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full sm:w-96 p-8 bg-white shadow-lg rounded-lg">
        <h3 className="text-center text-2xl font-bold text-blue-500 mb-6">Login Form</h3>
        <Form layout="vertical" onFinish={onFinishHandler}>
        <Form.Item label={<span className="font-bold">Email</span>} name="email">
          <Input type="email" required className="border border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:border-blue-700" placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label={<span className="font-bold">Password</span>} name="password">
          <Input type="password" required className="border border-green-500 rounded-md px-4 py-2 focus:outline-none focus:border-green-700" placeholder="Enter your password" />
        </Form.Item>
          <Link to="/register" className="block mt-4 text-center text-blue-500 hover:underline font-semibold">
            Not a user? Register here
          </Link>
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full" type="submit">
            Login
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Login;

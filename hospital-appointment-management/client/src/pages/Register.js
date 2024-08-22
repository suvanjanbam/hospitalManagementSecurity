import { Form, Input, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background4.webp";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

// Password requirements
const passwordRequirements = {
  minLength: 8,
  maxLength: 12,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

// Function to assess password strength and requirements
const assessPassword = (password) => {
  const feedback = [];
  let strength = 0;

  if (password.length < passwordRequirements.minLength) {
    feedback.push(`Password must be at least ${passwordRequirements.minLength} characters long.`);
  } else if (password.length > passwordRequirements.maxLength) {
    feedback.push(`Password must be no more than ${passwordRequirements.maxLength} characters long.`);
  } else {
    strength += 1; // Strength point for length
  }

  if (!passwordRequirements.uppercase.test(password)) {
    feedback.push("Password must contain at least one uppercase letter.");
  } else {
    strength += 1; // Strength point for uppercase
  }

  if (!passwordRequirements.lowercase.test(password)) {
    feedback.push("Password must contain at least one lowercase letter.");
  } else {
    strength += 1; // Strength point for lowercase
  }

  if (!passwordRequirements.number.test(password)) {
    feedback.push("Password must contain at least one number.");
  } else {
    strength += 1; // Strength point for number
  }

  if (!passwordRequirements.specialChar.test(password)) {
    feedback.push("Password must contain at least one special character.");
  } else {
    strength += 1; // Strength point for special character
  }

  return { feedback, strength };
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [passwordFeedback, setPasswordFeedback] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [lastMessage, setLastMessage] = useState('');

  // Handle password change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const { feedback, strength } = assessPassword(password);
    setPasswordFeedback(feedback);
    setPasswordStrength(strength);

    // Show only the first feedback message
    if (feedback.length > 0) {
      const newMessage = feedback[0];
      if (newMessage !== lastMessage) {
        setLastMessage(newMessage);
        message.warning(newMessage);
      }
    } else {
      // Clear message if password is valid
      if (lastMessage) {
        setLastMessage('');
        message.destroy();
      }
    }
  };

  // Handle form submission
  const onFinishHandler = async (values) => {
    const { password } = values;
    const { feedback } = assessPassword(password);

    // Show feedback if there are validation issues
    if (feedback.length > 0) {
      feedback.forEach(msg => message.warning(msg));
      return; // Prevent form submission if password does not meet requirements
    }

    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Registered Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      <div className="w-full sm:w-96 p-8 bg-white shadow-lg rounded-lg">
        <h3 className="text-center text-2xl font-bold text-blue-500 mb-6">Register Form</h3>
        <Form layout="vertical" onFinish={onFinishHandler} form={form}>
          <Form.Item label={<span className="font-bold">Name</span>} name="name">
            <Input 
              type="text" 
              required 
              className="border border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:border-blue-700 font-bold italic" 
              placeholder="Enter your name" 
            />
          </Form.Item>
          <Form.Item label={<span className="font-bold">Email</span>} name="email">
            <Input 
              type="email" 
              required 
              className="border border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:border-blue-700 font-bold italic" 
              placeholder="Enter your email" 
            />
          </Form.Item>
          <Form.Item label={<span className="font-bold">Password</span>} name="password">
            <Input.Password 
              required 
              className="border border-blue-500 rounded-md px-4 py-2 focus:outline-none focus:border-blue-700 font-bold italic" 
              placeholder="Enter your password" 
              onChange={handlePasswordChange} 
            />
          </Form.Item>
          <div className="mt-4">
            {passwordStrength === 5 && <div className="text-green-500">Password strength: Strong</div>}
            {passwordStrength > 0 && passwordStrength < 5 && <div className="text-yellow-500">Password strength: Moderate</div>}
            {passwordStrength === 0 && <div className="text-red-500">Password strength: Weak</div>}
          </div>
          <Link to="/login" className="block mt-4 text-center text-blue-500 hover:underline font-semibold">
            Already a user? Login here
          </Link>
          <button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full border-2 border-blue-600"
            type="submit"
          >
            Register
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Register;

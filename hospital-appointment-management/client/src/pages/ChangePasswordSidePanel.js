import { Col, Form, Input, Row, Button, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import Layout from "./../components/Layout";
import axios from "axios";

const passwordRequirements = {
  minLength: 8,
  maxLength: 12,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

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

const ChangePasswordSidePanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordFeedback, setPasswordFeedback] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const { feedback, strength } = assessPassword(password);
    setPasswordFeedback(feedback);
    setPasswordStrength(strength);
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 5:
        return "Strong";
      case 4:
        return "Good";
      case 3:
        return "Fair";
      case 2:
        return "Weak";
      default:
        return "Very Weak";
    }
  };

  // handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/change-password",
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/"); // Redirect after successful password change
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Change Password</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <Row gutter={20}>
          <Col xs={24} md={24} lg={12}>
            <Form.Item
              label="Current Password"
              name="currentPassword"
              required
              rules={[{ required: true, message: "Please input your current password!" }]}
            >
              <Input.Password placeholder="Your current password" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item
              label="New Password"
              name="newPassword"
              required
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 8, message: "" },
              ]}
            >
              <Input.Password 
                placeholder="Your new password"
                onChange={handlePasswordChange}
              />
            </Form.Item>
            <ul>
              {passwordFeedback.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
            <p>Password Strength: {getStrengthText(passwordStrength)}</p>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              required
              rules={[
                { required: true, message: "Please confirm your new password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your new password" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Button type="primary" htmlType="submit" className="form-btn">
              Change Password
            </Button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ChangePasswordSidePanel;

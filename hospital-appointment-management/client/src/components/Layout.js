import React from "react";
import { adminMenu, userMenu } from "./../Data/data";

import { Badge, message } from "antd";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // Doctor menu
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
    {
      name: "Change Password",
      path: "/change-password",
      icon: "fa-solid fa-key",
    },
  ];

  // Rendering menu list
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <div className="min-h-screen font-medium flex">
      {/* Sidebar */}
      <div className="w-1/5 bg shadow-md">
        <div className="p-4">
          <h6 className="text-2xl text-blue-600 font-bold hidden md:block">
            Hospital #1
          </h6>
          <hr className="my-4 hidden md:block" />
          <div className="space-y-2">
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.path}
                  className={`flex items-center p-2 rounded-lg ${
                    isActive ? "bg-blue-200" : ""
                  }`}
                >
                  <i className={`${menu.icon} mr-2 text-blue-600`}></i>
                  <Link
                    to={menu.path}
                    className={`${
                      isActive ? "font-bold" : ""
                    } hidden md:flex items-center text-blue-600`}
                  >
                    {menu.name}
                  </Link>
                </div>
              );
            })}
            <div
              className="flex items-center p-2 rounded-lg"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket mr-2 text-blue-600"></i>
              <Link to="/login" className="text-blue-600">
                <span className={`${user ? "hidden md:inline" : "inline"}`}>
                  Logout
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-4/5 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-4">
            <Badge
              count={user && user.notifcation.length}
              onClick={() => {
                navigate("/notification");
              }}
              className="cursor-pointer"
            >
              <i className="fa-solid fa-bell text-blue-600"></i>
            </Badge>
            <div className="text-blue-600 ml-2 font-bold">{user?.name}</div>
          </div>
        </div>

        {/* Body */}
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

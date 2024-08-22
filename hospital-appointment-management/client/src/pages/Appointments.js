
import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Layout from "./../components/Layout";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      className: "text-gray-800",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span className="text-gray-800">
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
      className: "text-gray-800",
    },
    {
      title: "Status",
      dataIndex: "status",
      className: "text-gray-800",
    },
  ];

  return (
    <Layout>
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-4">Appointments List</h1>
      </div>
      <Table
        className="w-full border border-gray-800"
        columns={columns}
        dataSource={appointments}
      />
    </Layout>
  );
};

export default Appointments;



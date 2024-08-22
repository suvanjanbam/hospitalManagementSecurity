import React, { useState, useEffect } from "react";
import { Table, Spin, message, Button } from "antd";
import axios from "axios";
import Layout from "./../components/Layout";

const UserActivity = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const fetchUserActivity = async () => {
    try {
      const response = await axios.get("/api/v1/user/activity");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      message.error("Failed to fetch user activity.");
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await axios.post("/api/v1/user/activity/clear");
      message.success("Logs cleared successfully.");
      fetchUserActivity(); // Refresh the logs after clearing
    } catch (error) {
      console.error("Error clearing logs:", error);
      message.error("Failed to clear logs.");
    }
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
      render: (text) => <pre>{JSON.stringify(text, null, 2)}</pre>,
    },
  ];

  return (
    <Layout>
      <h1 className="text-center">User Activity</h1>
      <div className="text-center">
        <Button 
          type="danger" 
          onClick={handleClearLogs} 
          style={{ marginBottom: '20px' }}
        >
          Clear Logs
        </Button>
      </div>
      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="timestamp"
          pagination={{ pageSize: 10 }}
        />
      )}
    </Layout>
  );
};

export default UserActivity;

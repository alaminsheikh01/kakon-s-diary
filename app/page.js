"use client";
import { Table, Input, Button, Progress, DatePicker, Spin } from "antd";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/src/config/firestore";
import dayjs from "dayjs";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [form, setForm] = useState({ date: "", expense: 0, reason: "" });
  const [monthID, setMonthID] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Kakon's Diary";
  }, []);

  const addRow = () => {
    if (!form.date || !form.expense || !form.reason) {
      alert("Please fill all fields before adding a row.");
      return;
    }

    const newRow = {
      key: Date.now(),
      date: form.date,
      expense: parseFloat(form.expense),
      reason: form.reason,
    };

    setData([...data, newRow]);
    setForm({
      date: new Date().toISOString().split("T")[0],
      expense: 0,
      reason: "",
    });
  };

  const loadExistingData = async (formattedMonthID) => {
    try {
      setLoading(true);
      const docRef = doc(db, "expenses", formattedMonthID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        setTotalRevenue(existingData.totalRevenue);
        setData(existingData.rowList || []);
      } else {
        setTotalRevenue(0);
        setData([]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (value) => {
    const formattedMonthID = dayjs(value).format("MMMM-YYYY");
    setMonthID(value);
    loadExistingData(formattedMonthID);
  };

  const saveData = async () => {
    try {
      if (!monthID) {
        alert("Please set a month ID before saving.");
        return;
      }

      const formattedMonthID = dayjs(monthID).format("MMMM-YYYY");

      const totalRemaining =
        totalRevenue - data.reduce((acc, item) => acc + item.expense, 0);

      const docRef = doc(db, "expenses", formattedMonthID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const updatedRowList = [...existingData.rowList, ...data];
        const updatedTotalRemaining =
          totalRevenue -
          updatedRowList.reduce((acc, item) => acc + item.expense, 0);

        const updatedDocument = {
          monthID: formattedMonthID,
          totalRevenue,
          totalRemaining: updatedTotalRemaining,
          rowList: updatedRowList,
        };

        await setDoc(docRef, updatedDocument);
      } else {
        const newDocument = {
          monthID: formattedMonthID,
          totalRevenue,
          totalRemaining,
          rowList: data,
        };

        await setDoc(docRef, newDocument);
      }

      alert("Data saved successfully!");

      setData([]);
      setTotalRevenue(0);
      setMonthID("");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const deleteRow = (key) => {
    const updatedData = data.filter((row) => row.key !== key);
    setData(updatedData);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 150, // Fixed width for the Date column
      render: (text) => (
        <span style={{ fontSize: "12px" }}>
          {new Date(text).toDateString()}
        </span>
      ),
    },
    {
      title: "Expense",
      dataIndex: "expense",
      key: "expense",
      width: 100, // Fixed width for the Expense column
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 200, // Fixed width for the Reason column
      render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 100, // Fixed width for the Action column
      render: (_, record) => (
        <Button
          type="link"
          danger
          style={{ fontSize: "12px" }}
          onClick={() => deleteRow(record.key)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading} tip="Loading...">
      <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
        <div className="container max-w-screen-md bg-white shadow-md rounded-lg p-4 space-y-6">
          {/* Month and Revenue Inputs */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/3">
              <h2 className="text-lg font-semibold mb-1">Current Month</h2>
              <Input
                type="month"
                placeholder="Select Month"
                value={monthID}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <h3 className="text-lg font-semibold mb-1">Total Revenue:</h3>
              <Input
                type="number"
                placeholder="Enter Total Revenue"
                value={totalRevenue}
                onChange={(e) =>
                  setTotalRevenue(parseFloat(e.target.value) || 0)
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="w-full sm:w-1/3 sm:text-right">
              <h3 className="text-lg font-semibold mb-1">Remaining Amount:</h3>
              <Input
                disabled
                type="number"
                value={
                  totalRevenue -
                  data.reduce((acc, item) => acc + item.expense, 0)
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Form for Adding Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <DatePicker
              placeholder="Select Date"
              onChange={(date, dateString) =>
                setForm({ ...form, date: dateString })
              }
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Expense"
              value={form.expense}
              onChange={(e) => setForm({ ...form, expense: e.target.value })}
              className="w-full"
            />
            <Input
              placeholder="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full"
            />
            <Button onClick={addRow} type="primary" className="w-full">
              Add Row
            </Button>
          </div>

          <div className="fixed bottom-4 left-4 right-4 flex justify-center z-10">
            <Button
              size="small"
              onClick={saveData}
              type="primary"
              disabled={!monthID || data.length === 0}
              className="w-[90%] sm:w-[50%]"
            >
              Save Expenses
            </Button>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <Table
              dataSource={data}
              columns={columns}
              pagination={false}
              scroll={{ x: 600 }}
            />
          </div>

          {/* Progress */}
          <div className="mt-4 mb-6 sm:mb-0">
            <h2 className="text-lg font-semibold">Total Progress:</h2>
            <Progress
              percent={
                totalRevenue > 0
                  ? (
                      (100 *
                        data.reduce((acc, item) => acc + item.expense, 0)) /
                      totalRevenue
                    ).toFixed(2)
                  : 0
              }
            />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Dashboard;

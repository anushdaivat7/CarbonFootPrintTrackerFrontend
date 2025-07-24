import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = [
  "#4CAF50", "#2196F3", "#FF9800",
  "#9C27B0", "#E91E63", "#00BCD4", "#FF5722"
];

const EmissionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const email = localStorage.getItem("email");

  // Auto shift to previous month if it's 1st of the month
  useEffect(() => {
    const today = new Date();
    if (today.getDate() === 1) {
      const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
      const prevYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
      setSelectedMonth(prevMonth);
      setSelectedYear(prevYear);
    }
  }, []);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`https://carbonfootprinttrackerbackendasd.onrender.com/api/carbon/userLog/${email}`)
      .then((res) => {
        const logs = res.data;

        // Filter by selected month & year
        const filteredLogs = logs.filter((entry) => {
          const date = new Date(entry.timestamp);
          return (
            date.getMonth() === parseInt(selectedMonth) &&
            date.getFullYear() === parseInt(selectedYear)
          );
        });

        // Group by activity type
        const grouped = {};
        filteredLogs.forEach((entry) => {
          const type = entry.activityType;
          grouped[type] = (grouped[type] || 0) + entry.emission;
        });

        const result = Object.keys(grouped).map((type) => ({
          activityType: type,
          totalEmission: grouped[type],
        }));

        setChartData(result);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [email, selectedMonth, selectedYear]);

  const totalEmission = chartData.reduce(
    (sum, item) => sum + item.totalEmission,
    0
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔍 Filters for Month & Year */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {[2023, 2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Charts */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "20px"
      }}>
        {/* Bar Chart */}
        <div style={{
          flex: "1 1 48%",
          minWidth: "300px",
          height: "460px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            📊 Emissions by Activity (Bar)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activityType" label={{ value: "Activity Type", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "CO₂ (kg)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Bar dataKey="totalEmission" name="Emission (kg)" barSize={20}>
                {chartData.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{
          flex: "1 1 48%",
          minWidth: "300px",
          height: "460px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              🥧 Emissions Breakdown (Pie)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="totalEmission"
                  nameKey="activityType"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            textAlign: "center",
            marginTop: "10px",
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "#333"
          }}>
            ✅ Total CO₂ Emission: {totalEmission.toFixed(2)} kg
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionChart;




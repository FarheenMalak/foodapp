import React from "react";
import { FaShoppingCart, FaDollarSign, FaChartLine, FaUsers, FaMotorcycle } from "react-icons/fa";
import './Cards.css'

const iconMap = {
    "Total Orders Today": <FaShoppingCart />,
    "Total Revenue Today": <FaDollarSign />,
    "Average Order Value": <FaChartLine />,
    "New Customers": <FaUsers />,
    "Active Deliveries": <FaMotorcycle />,
};

const PerformanceCard = ({ title, value }) => (
    <div className="performance-card">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {iconMap[title]}
            <span>{title}</span>
        </div>
        <h3>{value}</h3>
    </div>
);

export default PerformanceCard;

import React, { useEffect, useState } from "react";
import PerformanceCard from "../../components/Cards/PerformanceCard";
import QuickActionCard from "../../components/Cards/QuickActionCard";
import "./Home.css";
import { useNavigate } from 'react-router-dom'

const Home = ({ url }) => {
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const statsRes = await fetch(`${url}/api/order/dashboard-stats`);
            const statsData = await statsRes.json();
            setStats(statsData.data);

            const actRes = await fetch(`${url}/api/order/list`);
            const actData = await actRes.json();

            const recent = actData.data.slice(0, 6).map((o) => ({
                message: `Order #${o._id}`,
                status: o.status,
                time: o.createdAt,
            }));

            setActivities(recent);
        };

        fetchData();
    }, [url]);

    if (!stats)
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );

    return (
        <div className="dashboard-content">

            {/* HEADER */}
            <h2 className="dash-title">Welcome, Admin!</h2>
            <p className="dash-subtitle">
                Here's a quick overview of your food delivery operations today.
            </p>

            {/* PERFORMANCE CARDS */}
            <div className="stats-grid">
                <PerformanceCard title="Total Orders Today" value={stats.ordersToday} />
                <PerformanceCard title="Total Revenue Today" value={`$${stats.revenueToday}`} />
                <PerformanceCard title="Average Order Value" value={`$${stats.aov}`} />
                <PerformanceCard title="New Customers" value={stats.newCustomers} />
                <PerformanceCard title="Active Deliveries" value={stats.activeDeliveries} />
            </div>

            {/* QUICK ACTIONS */}
            <h3 className="section-heading">Quick Actions</h3>

            <div className="quick-grid">
                <QuickActionCard title="Add New Dish" onClick={() => navigate('/add')} />
                <QuickActionCard title="Manage Menus" onClick={() => navigate('/list')} />
                <QuickActionCard title="View Today's Orders" onClick={() => navigate('/orders')} />
                <QuickActionCard title="Manage Promotions" />
            </div>


            {/* RECENT ACTIVITY */}
            <h3 className="section-heading">Recent Activity</h3>

            <div className="activity-box">
                {activities.map((a, i) => (
                    <div key={i} className="activity-item">
                        <span className="activity-text">
                            {a.message} — <span className="status">{a.status}</span>
                        </span>

                        <span className="time">
                            {new Date(a.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Home;

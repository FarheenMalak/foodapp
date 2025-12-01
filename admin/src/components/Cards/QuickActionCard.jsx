import React from "react";
import { FaPlus, FaUtensils, FaListAlt, FaTags } from "react-icons/fa";
import './Cards.css'

const QuickActionCard = ({ title, onClick }) => {
    const iconMap = {
        "Add New Dish": <FaPlus />,
        "Manage Menus": <FaUtensils />,
        "View Today's Orders": <FaListAlt />,
        "Manage Promotions": <FaTags />,
    };

    return (
        <div className="quick-action-card" onClick={onClick}>
            {iconMap[title]}
            <span>{title}</span>
        </div>
    );
};

export default QuickActionCard;

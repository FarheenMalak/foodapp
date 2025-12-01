import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlus,
  FaListAlt,
  FaClipboardList
} from "react-icons/fa"; // React Icons import

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/" className="sidebar-option">
          <FaTachometerAlt className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <FaPlus className="sidebar-icon" />
          <span>Add Items</span>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <FaListAlt className="sidebar-icon" />
          <span>List Items</span>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <FaClipboardList className="sidebar-icon" />
          <span>Orders</span>
        </NavLink>

      </div>
    </div>
  );
};

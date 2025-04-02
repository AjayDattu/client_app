"use client";

import { useState } from "react";
import { Menu, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { auth, signOut } from "@/lib/firebase";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // Dropdown Menu
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/30 flex justify-between items-center">
      {/* Logo */}
        <Dropdown overlay={menu} trigger={["click"]}>
          <button className="flex items-center gap-3 px-4 py-2 transition duration-200">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </button>
        </Dropdown>
    </nav>
  );
}

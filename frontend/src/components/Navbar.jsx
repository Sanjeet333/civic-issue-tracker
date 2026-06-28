import React, { useContext, useState, useEffect } from "react";
import { Shield, LogOut, Bell } from "lucide-react";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    if (!user || user.role === 'admin') return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://civic-issue-tracker-lixd.onrender.com/api/issues/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data.data || []);
      } catch (err) { console.error("Error fetching notifications:", err); }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleBellClick = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      try {
        const token = localStorage.getItem("token");
        await axios.put("http://localhost:5000/api/issues/notifications/mark-read", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) { console.error("Read update error:", err); }
    }
  };

  if (!user) return null;

  const name = user.username || user.name || "User";
  const role = user.role || "citizen"; 
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md text-white shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-400" />
          <span className="font-bold tracking-tight">Community Hero</span>
        </div>

        <div className="flex items-center gap-4">
          
          {role !== 'admin' && (
            <div className="relative">
              <div onClick={handleBellClick} className="cursor-pointer p-2 hover:bg-slate-800 rounded-full transition">
                <Bell className="h-5 w-5 text-slate-400 hover:text-indigo-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 p-2">
                  <h3 className="text-white text-xs font-bold p-2 border-b border-slate-700">Recent Updates</h3>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n._id} className="p-3 text-xs text-slate-300 hover:bg-slate-700 border-b border-slate-700 last:border-0 cursor-default">
                          {n.message}
                          <p className="text-[9px] text-slate-500 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs p-4 text-center">No new updates</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-sm font-medium text-slate-200">{name}</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border ${
            role === 'admin' ? 'bg-rose-900/30 text-rose-300 border-rose-800' : 'bg-emerald-900/30 text-emerald-300 border-emerald-800'
          }`}>{role}</span>
          
          <button onClick={logout} className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-bold transition-all">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
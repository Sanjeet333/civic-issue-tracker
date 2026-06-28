import React, { useState, useEffect } from "react";
import { X, Tag, MapPin, AlertTriangle } from "lucide-react"; 
import axios from "axios";

const AdminPanel = () => {
  const [issues, setIssues] = useState([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://civic-issue-tracker-lixd.onrender.com/api/issues", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIssues(response.data.data || []);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };
    fetchIssues();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`https://civic-issue-tracker-lixd.onrender.com/api/issues/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(issues.map((issue) => 
        issue._id === id ? { ...issue, status: newStatus } : issue
      ));
    } catch (error) {
      alert("Update failed!");
    }
  };

  const getUrgencyStyle = (score) => {
    if (score >= 8) return { text: "High", color: "text-red-500", bg: "bg-red-500/10" };
    if (score >= 5) return { text: "Medium", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { text: "Low", color: "text-emerald-500", bg: "bg-emerald-500/10" };
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': return "bg-emerald-900/30 text-emerald-400 border-emerald-800";
      case 'Investigating': return "bg-amber-900/30 text-amber-400 border-amber-800";
      case 'Pending': return "bg-rose-900/30 text-rose-400 border-rose-800";
      default: return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (issue.status === "Withdrawn") return false;
    const matchesSearch = issue.title?.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          issue.description?.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-slate-100">
      <h1 className="text-2xl font-bold mb-6 text-white">Admin Control Panel</h1>

      <div className="flex gap-4 mb-6">
        <input 
          type="text" placeholder="Search issues..." 
          className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex-1 outline-none text-sm text-white"
          onChange={(e) => setAdminSearch(e.target.value)}
        />
        <select className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-sm text-white" onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredIssues.map((issue) => {
          const urgency = getUrgencyStyle(issue.urgencyScore || 0);
          return (
            <div key={issue._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">{issue.title}</h3>
                <select value={issue.status} onChange={(e) => handleStatusChange(issue._id, e.target.value)} 
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${getStatusStyle(issue.status)}`}>
                  <option value="Pending">Pending</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">
                  <Tag size={10} /> {issue.category || "General"}
                </span>
                
                <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border ${urgency.bg} ${urgency.color}`}>
                  <AlertTriangle size={10} /> {urgency.text} Priority
                </span>

                {issue.location?.address && (
                  <div className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-950/30 px-2 py-1 rounded border border-indigo-900/50">
                    <MapPin size={10} /> 
                    <span className="max-w-[200px] truncate">{issue.location.address}</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-slate-400 mb-3">{issue.aiSummary || issue.description}</p>
              
              {issue.mediaUrl && (
                <div onClick={() => setPreviewImage(issue.mediaUrl)} className="w-full h-40 bg-slate-950 rounded-lg overflow-hidden cursor-pointer border border-slate-800 hover:opacity-90 transition">
                  <img src={issue.mediaUrl} alt="Issue" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-5 right-5 text-white p-2 bg-black/50 rounded-full hover:bg-black">
            <X size={30}/>
          </button>
          <img src={previewImage} className="max-h-[90vh] max-w-4xl w-full object-contain rounded-lg" alt="Full Preview" />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
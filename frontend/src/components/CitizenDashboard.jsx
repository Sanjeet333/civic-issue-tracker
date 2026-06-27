import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import API from './lib/api';

const CitizenDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || user._id;

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const response = await API.get("/issues");
        const data = response.data?.data;
        setIssues(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Kya aap sach mein ye report delete karna chahte hain?")) {
      try {
        await API.delete(`/issues/delete/${id}`); 
        setIssues(prev => prev.filter(issue => issue._id !== id));
        alert("Report successfully deleted!");
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Delete fail ho gaya!";
        alert(errorMsg);
      }
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (filter === "All") return true;
    if (filter === "Pending") return issue.status === "Pending" || issue.status === "Investigating";
    return issue.status === filter;
  });

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Reports</h1>
        <button onClick={() => navigate('/report')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold transition">
          <Plus size={18} /> New Report
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2 overflow-x-auto">
        {["All", "Pending", "Resolved", "Investigating"].map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 text-sm font-bold rounded-t-lg transition ${filter === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-slate-400">Loading your reports...</div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg font-bold mb-2">Koi report nahi mili</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div key={issue._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700 flex flex-col">
              {issue.mediaUrl && (
                <img src={issue.mediaUrl} className="w-full h-40 object-cover rounded-lg cursor-pointer mb-3 hover:opacity-90" onClick={() => setPreviewImage(issue.mediaUrl)} alt="Issue" />
              )}
              
              <h3 className="font-bold text-lg mb-1 text-white">{issue.title}</h3>
              
              {issue.location?.address && (
                <div className="flex items-start gap-1 text-[10px] text-indigo-400 mb-3 bg-indigo-950/30 px-2 py-1 rounded w-full">
                  <MapPin size={12} className="mt-0.5 shrink-0" /> 
                  <span className="leading-tight">{issue.location.address}</span>
                </div>
              )}

              <p className="text-sm text-slate-400 mb-4 flex-grow">
                {issue.description?.length > 80 ? issue.description.slice(0, 80) + "..." : issue.description}
              </p>
              
              <div className="flex justify-between items-center mt-auto border-t border-slate-800 pt-3">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                  issue.status === 'Resolved' ? 'bg-emerald-900/50 text-emerald-400' : 
                  issue.status === 'Pending' ? 'bg-amber-900/50 text-amber-400' : 'bg-slate-800 text-slate-400'
                }`}>{issue.status}</span>
                
                {issue.status === "Pending" && issue.user === currentUserId && (
                  <button onClick={() => handleDelete(issue._id)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-xs font-bold">
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-5 right-5 text-white p-2 bg-black/50 rounded-full hover:bg-black"><X size={30}/></button>
          <img src={previewImage} className="max-h-[90vh] max-w-4xl w-full object-contain rounded-lg" alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
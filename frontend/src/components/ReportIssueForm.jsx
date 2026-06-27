import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MapPicker from "./MapPicker"; 

const ReportIssueForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return alert("Please select the issue location on the map!");
    
    setIsSubmitting(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", JSON.stringify(location));
    if (file) data.append("media", file);

    try {
      const token = localStorage.getItem("token"); 
      await axios.post("http://localhost:5000/api/issues/report", data, {
        headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` }
      });
      alert("Report Submitted with Location!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to report issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-indigo-400">← Back</button>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Report with Location</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="title" placeholder="Title" onChange={handleChange} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white" required />
          <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white h-24" required />
          
          {/* Map Section */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <MapPicker setLocation={setLocation} location={location} />
          </div>

          <input type="file" onChange={handleFileChange} className="w-full p-2 bg-slate-950 text-slate-400 text-sm" />
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 rounded-xl text-white font-bold">
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueForm;
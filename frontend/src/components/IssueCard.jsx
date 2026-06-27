import React from 'react';

const IssueCard = ({ issue }) => {
  if (!issue) return null;

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Available";
  };

  return (
    <div className="max-w-md mx-auto my-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {issue.mediaUrl ? (
        <div className="mb-4 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
          {issue.mediaType === 'video' ? (
            <video 
              src={issue.mediaUrl} 
              controls 
              className="w-full h-48 object-cover" 
            />
          ) : (
            <img 
              src={issue.mediaUrl} 
              alt={issue.title || "Issue Image"} 
              onError={handleImageError}
              className="w-full h-48 object-cover" 
            />
          )}
        </div>
      ) : (
        <div className="mb-4 w-full h-48 bg-slate-100 flex items-center justify-center rounded-lg border border-dashed border-slate-300">
          <span className="text-slate-400 text-xs italic">No media attached</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {issue.category}
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <h3 className="text-base font-bold text-slate-800 mb-1">
        {issue.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-2">
        {issue.description}
      </p>
      
      {issue.aiSummary && (
        <p className="text-xs italic text-indigo-600 mb-4">AI Summary: {issue.aiSummary}</p>
      )}

      <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-3">
        <span>Urgency: {issue.urgencyScore}/10</span>
        <span className={`font-semibold ${issue.status === 'Resolved' ? 'text-green-600' : 'text-blue-600'}`}>
          {issue.status}
        </span>
      </div>
    </div>
  );
};

export default IssueCard;
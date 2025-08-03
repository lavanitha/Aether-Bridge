import React from "react";

export default function AppReview() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl bg-black bg-opacity-70 rounded-2xl shadow-card p-4 border border-border">
        <h1 className="text-3xl font-bold mb-2 text-left text-white">Admin Dashboard: Application Review</h1>
        <p className="mb-4 text-left text-lg text-gray-300">Review and manage student applications for inter-institutional programs.</p>
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary">Pending Applications</h2>
          <p className="mb-2 text-gray-400">Review the applications submitted by students.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-white">Student Name</th>
                  <th className="py-2 px-4 text-left text-white">Program</th>
                  <th className="py-2 px-4 text-left text-white">Date Submitted</th>
                  <th className="py-2 px-4 text-left text-white">Status</th>
                  <th className="py-2 px-4 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-700">
                  <td className="py-2 px-4 text-white">Alex Doe</td>
                  <td className="py-2 px-4 text-white">Computer Science</td>
                  <td className="py-2 px-4 text-white">2024-01-15</td>
                  <td className="py-2 px-4"><span className="px-2 py-1 rounded-full bg-yellow-600 text-white text-xs">Pending</span></td>
                  <td className="py-2 px-4">
                    <button className="px-3 py-1 bg-green-600 text-white rounded mr-2">Approve</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
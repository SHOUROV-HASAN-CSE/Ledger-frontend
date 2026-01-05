"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { formatBengaliCurrency } from "../utils/formatter";

interface LedgerUser {
  user_id: number;
  user_name: string;
  user_alt_name: string;
  user_address: string;
  user_amount: number;
}

export default function LedgerTable({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) {
  const [data, setData] = useState<LedgerUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:5000/api/ledger")
      .then((res) => res.json())
      .then((data) => {
        // Sort data by user_id descending (newest first)
        const sortedData = [...data].sort(
          (a: LedgerUser, b: LedgerUser) => b.user_id - a.user_id
        );
        setData(sortedData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [refreshTrigger]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleDownload = () => {
    const formattedData = data.map((item) => ({
      ...item,
      user_amount: formatBengaliCurrency(item.user_amount),
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, "ledger_records.xlsx");
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-violet-400">Saved Records</h2>
        <button
          onClick={handleDownload}
          className="bg-slate-900 hover:bg-slate-950 text-white font-medium py-2.5 px-8 rounded-lg transition-colors shadow-lg border border-slate-700"
        >
          Download Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-6 py-3 text-left text-2xl font-medium text-slate-300  tracking-wider">
                নাম
              </th>
              <th className="px-6 py-3 text-left text-2xl font-medium text-slate-300  tracking-wider">
                Alt Name
              </th>
              <th className="px-6 py-3 text-center text-2xl font-medium text-slate-300  tracking-wider">
                ঠিকানা
              </th>
              <th className="px-6 py-3 text-right text-2xl font-medium text-slate-300 tracking-wider">
               টাকার পরিমাণ
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {currentItems.map((user) => (
              <tr key={user.user_id}>
                <td className="px-6 py-4 whitespace-nowrap text-2xl text-slate-300">
                  {user.user_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-2xl text-slate-300">
                  {user.user_alt_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-2xl text-slate-300">
                  {user.user_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-2xl text-slate-300 font-bold text-right">
                  {formatBengaliCurrency(user.user_amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-slate-300 border border-slate-600 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                currentPage === page
                  ? "bg-violet-600 text-white border border-violet-600"
                  : "text-slate-300 border border-slate-600 hover:bg-slate-700"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-slate-300 border border-slate-600 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

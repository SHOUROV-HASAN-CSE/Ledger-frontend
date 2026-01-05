"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  toEnglishNumber,
  formatBengaliCurrency,
  formatInputAsBengaliNumber,
} from "@/utils/formatter";
import { toBengali } from "@/utils/avro";

export default function LedgerForm({ onSave }: { onSave: () => void }) {
  const [addressList, setAddressList] = useState([
    "ডুমুরিয়া",
    "বাইন তলা",
    "বটতলা",
    "বরইতলা",
    "বড় লক্ষ্মীখালী",
    "ছোট লক্ষ্মীখালী",
    "সাহেবেরমেঠ",
    "আদর্শগ্রাম",
    "বয়া সিংহা",
    "মাদুরপাল্টা",
    "ভাইজোরা",
    "পালের খণ্ড",
    "খোণকারের বেড়",
  ]);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
  const isComposing = useRef(false);

  const [formData, setFormData] = useState({
    user_name: "",
    user_alt_name: "",
    user_address: "",
    user_amount: "",
  });

  const fetchTotalAmount = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ledger");
      const data = await response.json();
      const total = data.reduce(
        (sum: number, item: { user_amount: string | number }) =>
          sum + (Number(item.user_amount) || 0),
        0
      );
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTotalAmount();
  }, [fetchTotalAmount]);

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    isComposing.current = false;
    const value = e.currentTarget.value;
    if (/^[0-9০-৯.,]*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        user_amount: formatInputAsBengaliNumber(value),
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "user_address" && value === "add_new") {
      setIsAddingNewAddress(true);
      setCustomAddress("");
    } else if (name === "user_amount") {
      if (isComposing.current) {
        setFormData({ ...formData, [name]: value });
        return;
      }
      if (/^[0-9০-৯.,]*$/.test(value)) {
        setFormData({ ...formData, [name]: formatInputAsBengaliNumber(value) });
      }
    } else if (name === "user_name" || name === "user_alt_name") {
      const bengaliText = toBengali(value);
      setFormData({ ...formData, [name]: bengaliText });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCustomAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomAddress(e.target.value);
  };

  const handleCustomAddressBlur = () => {
    if (customAddress.trim()) {
      setAddressList([...addressList, customAddress]);
      setFormData({ ...formData, user_address: customAddress });
    }
    setIsAddingNewAddress(false);
  };

  const handleCustomAddressKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomAddressBlur();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        user_amount: toEnglishNumber(formData.user_amount).replace(/,/g, ""),
      };

      const response = await fetch("http://localhost:5000/api/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setFormData({
          user_name: "",
          user_alt_name: "",
          user_address: "",
          user_amount: "",
        });
        fetchTotalAmount();
        onSave();
      } else {
        alert("Failed to save");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving data");
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl p-[2px] shadow-2xl">
        <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4285F4_0%,#EA4335_25%,#FBBC05_50%,#34A853_75%,#4285F4_100%)]" />
        <div className="relative bg-[#1E293B] p-8 rounded-xl h-full w-full">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <h2 className="text-xl font-semibold text-violet-400">
              Basic Information
            </h2>
            <button
              onClick={() => setIsTotalModalOpen(true)}
              className="bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-700/50 text-violet-400 font-bold transition-colors"
            >
              Total Taka
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Alternative Name
                </label>
                <input
                  type="text"
                  name="user_alt_name"
                  value={formData.user_alt_name}
                  onChange={handleChange}
                  placeholder="Enter Alt Name"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Address
                </label>
                {isAddingNewAddress ? (
                  <input
                    type="text"
                    value={customAddress}
                    onChange={handleCustomAddressChange}
                    onBlur={handleCustomAddressBlur}
                    onKeyDown={handleCustomAddressKeyDown}
                    autoFocus
                    placeholder="Enter new address"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                  />
                ) : (
                  <select
                    name="user_address"
                    value={formData.user_address}
                    onChange={handleChange}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none appearance-none"
                    required
                  >
                    <option value="" className="text-slate-500">
                      Select Address
                    </option>
                    {addressList.map((addr) => (
                      <option key={addr} value={addr}>
                        {addr}
                      </option>
                    ))}
                    <option
                      value="add_new"
                      className="font-bold text-violet-400"
                    >
                      + Add New
                    </option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Price (৳)
                </label>
                <input
                  type="text"
                  name="user_amount"
                  value={formData.user_amount}
                  onChange={handleChange}
                  onCompositionStart={handleCompositionStart}
                  onCompositionEnd={handleCompositionEnd}
                  placeholder="০"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-800 text-white font-medium py-2.5 px-8 rounded-lg transition-colors shadow-lg shadow-violet-900/20"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Total Taka Modal */}
      {isTotalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsTotalModalOpen(false)}
        >
          <div
            className="bg-[#1E293B] p-6 rounded-xl border border-slate-700 shadow-2xl max-w-sm w-full transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Total Amount</h3>
              <button
                onClick={() => setIsTotalModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-3xl font-bold text-violet-400">
                {formatBengaliCurrency(totalAmount)} ৳
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

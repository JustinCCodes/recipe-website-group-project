"use client";

import { useRef, useState } from "react";
import {
  deleteUnifiedHistoryItemAction,
  clearAllHistoryAction,
  clearTodaysHistoryAction,
  clearHistoryByDateRangeAction,
} from "../actions";
import type { UnifiedHistoryItem } from "@/features/search/types";

export default function SearchLogManager({
  initialHistory,
}: {
  initialHistory: UnifiedHistoryItem[];
}) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleDelete(item: UnifiedHistoryItem) {
    await deleteUnifiedHistoryItemAction(item);
  }
  async function handleClearAll() {
    await clearAllHistoryAction();
  }
  async function handleClearToday() {
    await clearTodaysHistoryAction();
  }
  const handleDateRangeDelete = async () => {
    if (!startDate || !endDate) {
      alert("Please select both a start and end date.");
      return;
    }
    await clearHistoryByDateRangeAction(new Date(startDate), new Date(endDate));
    modalRef.current?.close(); // close modal after success
  };

  return (
    <div>
      <div className="mb-8 p-4 rounded-lg flex items-center justify-end">
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            role="button"
            className="btn btn-error active:scale-95 no-animation"
          >
            <span>Delete</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 bg-base-200 rounded-box w-52"
          >
            <li>
              <form action={handleClearToday}>
                <button type="submit" className="w-full text-left">
                  Todays History
                </button>
              </form>
            </li>

            <li>
              <button onClick={() => modalRef.current?.showModal()}>
                By Date Range
              </button>
            </li>

            <li>
              <form action={handleClearAll}>
                <button type="submit" className="w-full text-left">
                  Delete all activity
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        {initialHistory.length > 0 ? (
          initialHistory.map((item) => (
            <div
              key={`${item.source}-${item.id}`}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{item.query}</p>
                <p className="text-sm text-gray-400">
                  {item.createdAt.toLocaleString()}
                </p>
              </div>

              <form action={() => handleDelete(item)}>
                <button
                  type="submit"
                  className="btn btn-circle btn-ghost btn-sm active:scale-95 no-animation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </form>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-8">
            Your search history is empty.
          </p>
        )}
      </div>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete History by Date Range</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">From</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">To</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-action">
            <button className="btn" onClick={() => modalRef.current?.close()}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDateRangeDelete}>
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

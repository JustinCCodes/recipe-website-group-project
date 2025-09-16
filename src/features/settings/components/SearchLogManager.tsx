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
  // Reference to the date-range
  const modalRef = useRef<HTMLDialogElement>(null);
  // Controlled inputs for date-range deletion
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /**
   * Wrapper functions around server actions
   * Needed so they can be used in forms or onClick handlers
   */
  async function handleDelete(item: UnifiedHistoryItem) {
    await deleteUnifiedHistoryItemAction(item);
  }
  // Deletes all history
  async function handleClearAll() {
    await clearAllHistoryAction();
  }
  // Deletes Todays history
  async function handleClearToday() {
    await clearTodaysHistoryAction();
  }
  // Deletes history within a custom date range
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
      {/* Top right delete dropdown menu */}
      <div className="mb-8 p-4 rounded-lg flex items-center justify-end">
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            role="button"
            className="btn btn-error active:scale-95 no-animation"
          >
            <span>Delete</span>
            {/* Downward arrow icon */}
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
            {/* Clear only todays history */}
            <li>
              <form action={handleClearToday}>
                <button type="submit" className="w-full text-left">
                  Todays History
                </button>
              </form>
            </li>

            {/* Open date range */}
            <li>
              <button onClick={() => modalRef.current?.showModal()}>
                By Date Range
              </button>
            </li>

            {/* Clear all history */}
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

      {/* History list */}
      <div className="space-y-2">
        {initialHistory.length > 0 ? (
          initialHistory.map((item) => (
            <div
              key={`${item.source}-${item.id}`}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              {/* Query text + timestamp */}
              <div>
                <p className="font-medium">{item.query}</p>
                <p className="text-sm text-gray-400">
                  {item.createdAt.toLocaleString()}
                </p>
              </div>

              {/* Delete single history item */}
              <form action={() => handleDelete(item)}>
                <button
                  type="submit"
                  className="btn btn-circle btn-ghost btn-sm active:scale-95 no-animation"
                >
                  {/* X icon */}
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
          // Empty state
          <p className="text-center text-gray-500 p-8">
            Your search history is empty.
          </p>
        )}
      </div>

      {/* Date range delete */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete History by Date Range</h3>
          <div className="py-4 space-y-4">
            {/* Start date input */}
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
            {/* End date input */}
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

          {/* Action buttons */}
          <div className="modal-action">
            <button className="btn" onClick={() => modalRef.current?.close()}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDateRangeDelete}>
              Delete
            </button>
          </div>
        </div>
        {/* Clicking backdrop closes it */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

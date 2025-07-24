import React, { useState, useMemo, useEffect } from "react";
import { Trash2, Loader, PlusCircle, Merge, FileDown, X } from "lucide-react";
import jsPDF from "jspdf";
import toast, { Toaster } from "react-hot-toast";
import auth from "../config/config";
import { useNavigate } from "react-router-dom";
import deleteTask from "../api/deleteTask";
import saveTask from "../api/saveTask";
import fetchData from "../api/fetchUserTasks";
import { formatDistanceToNow } from "date-fns";

const MergeModal = ({
  onMerge,
  onCancel,
  newHeading,
  setNewHeading,
  isProcessing,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Merge Tasks
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Provide a new heading for the combined task.
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Input Field */}
          <div>
            <label
              htmlFor="merge-heading"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Task Heading
            </label>
            <input
              id="merge-heading"
              type="text"
              placeholder="e.g., Q3 Project Plan..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onMerge}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : null}
              {isProcessing ? "Saving..." : "Save Merge"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const isPaidMember = true;
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [newMergeHeading, setNewMergeHeading] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    fetchUserTasks();
  }, []);

  async function fetchUserTasks() {
    setIsLoading(true);
    try {
      const fetchedTasks = await fetchData();
      setTasks(fetchedTasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to fetch tasks.");
    } finally {
      setIsLoading(false);
    }
  }

  const deleteTaskfromDb = (e, id) => {
    e.stopPropagation();
    const promise = deleteTask(id).then(() => fetchUserTasks());
    toast.promise(promise, {
      loading: "Deleting task...",
      success: "Task deleted successfully!",
      error: "Failed to delete task.",
    });
  };

  const handleConfirmMerge = async () => {
    if (!newMergeHeading.trim()) {
      toast.error("Please enter a heading.");
      return;
    }

    setIsProcessing(true);
    const promise = mergeTask(tasks, selectedTasks, newMergeHeading)
      .then(() => {
        fetchUserTasks();
        setIsMerging(false);
        setSelectedTasks([]);
        setNewMergeHeading("");
      })
      .finally(() => {
        setIsProcessing(false);
      });

    toast.promise(promise, {
      loading: "Merging tasks...",
      success: `Tasks merged successfully!`,
      error: "Failed to merge tasks.",
    });
  };

  const mergeTask = async (allTasks, taskIds, newHeading) => {
    let filteredtask = [];
    for (let id of taskIds) {
      filteredtask.push(allTasks.filter((task) => task.id === id));
    }

    let mergeT = [];
    for (let task of filteredtask) {
      task = task[0].task_data;
      task.shift();
      mergeT = [...mergeT, ...task];
    }
    mergeT.unshift({ items: [], title: newHeading });

    await Promise.all(taskIds.map((id) => deleteTask(id)));
    await saveTask([
      {
        id: null,
        title: mergeT[0].title,
        task_data: mergeT,
      },
    ]);
  };

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .filter((task) =>
        task.task_heading.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  }, [searchTerm, tasks]);

  const openTask = (id) => {
    if (selectedTasks.length > 0) return;
    const task = tasks.find((task) => task.id === id);
    localStorage.setItem(
      auth.local_Storage.currentStorageKey,
      JSON.stringify(task)
    );
    navigate("/ai");
  };

  const handleSelectTask = (e, id) => {
    e.stopPropagation();
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const handleConvertToPdf = (e, task) => {
    e.stopPropagation();
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;
    const leftMargin = 15;
    const rightMargin = 15;
    const usableWidth = doc.internal.pageSize.width - leftMargin - rightMargin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    const titleLines = doc.splitTextToSize(task.task_heading, usableWidth);
    doc.text(titleLines, leftMargin, y);
    y += titleLines.length * 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Last updated: ${formatDistanceToNow(new Date(task.updated_at), {
        addSuffix: true,
      })}`,
      leftMargin,
      y
    );
    y += 15;

    doc.setTextColor(0);
    task.task_data.forEach((section) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(section.title, leftMargin, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      section.items.forEach((item) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }

        const boxSize = 4;
        const boxMargin = 3;
        const boxY = y - 3;

        doc.setDrawColor(0);
        doc.rect(leftMargin, boxY, boxSize, boxSize);

        if (item.checked) {
          doc.setLineWidth(0.5);
          doc.line(leftMargin + 1, boxY + 2, leftMargin + 2, boxY + 3);
          doc.line(leftMargin + 2, boxY + 3, leftMargin + 3.5, boxY + 1.5);
        }

        const textX = leftMargin + boxSize + boxMargin;
        const textWidth = usableWidth - (boxSize + boxMargin);
        const lines = doc.splitTextToSize(item.label, textWidth);
        doc.text(lines, textX, y);
        y += lines.length * 7;
      });
      y += 5;
    });

    const safeFileName = `${task.task_heading.replace(/ /g, "_")}.pdf`;
    doc.save(safeFileName);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {isMerging && (
        <MergeModal
          onMerge={handleConfirmMerge}
          onCancel={() => setIsMerging(false)}
          newHeading={newMergeHeading}
          setNewHeading={setNewMergeHeading}
          isProcessing={isProcessing}
        />
      )}

      {/* blur effect */}
      <div
        className={`w-full max-w-3xl mx-auto p-4 space-y-4 transition-all duration-300 ${
          isMerging ? "blur-md" : ""
        }`}
      >
        {/* Search and Merge UI */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search tasks by title..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isPaidMember && selectedTasks.length >= 2 && (
            <button
              onClick={() => setIsMerging(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Merge size={20} />
              Merge ({selectedTasks.length})
            </button>
          )}
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-16 flex flex-col items-center gap-4">
            <p className="text-xl font-medium">No Tasks Found</p>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle size={20} /> Create New Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isSelected = selectedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => openTask(task.id)}
                  className={`flex items-center justify-between p-4 border rounded-lg shadow-sm transition-all group ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/50 border-blue-400 dark:border-blue-500"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary dark:hover:border-primary"
                  } ${selectedTasks.length > 0 ? "" : "cursor-pointer"}`}
                >
                  {isPaidMember && (
                    <div className="mr-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectTask(e, task.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {task.task_heading}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Updated{" "}
                      {formatDistanceToNow(new Date(task.updated_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center ml-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    {isPaidMember && (
                      <button
                        onClick={(e) => handleConvertToPdf(e, task)}
                        className="p-2 rounded-full text-gray-400 hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-blue-900/50 transition-colors"
                        title="Download as PDF"
                      >
                        <FileDown className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => deleteTaskfromDb(e, task.id)}
                      className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

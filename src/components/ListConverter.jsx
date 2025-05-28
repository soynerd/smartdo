import React, { useEffect, useState } from "react";
import { Trash2, Plus, X, HardDriveUpload } from "lucide-react";
import auth from "../config/config";
import saveTaskToDb from "../api/saveTask";
const LOCAL_STORAGE_KEY = auth.local_Storage.currentStorageKey;

const ChecklistViewer = ({ data }) => {
  const [tasks, setTasks] = useState([]);
  const [heading, setHeading] = useState("");
  const [search, setSearch] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isSaved, setIsSaved] = useState(null);

  useEffect(() => {
    if (data?.length) {
      setTasks(data);
      localStorage.setItem(LOCAL_STORAGE_KEY,{id:null, task_data: JSON.stringify(data)});
    } else {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored).task_data);
    }
  }, [data]);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
  };

  const handleToggle = (sectionIndex, itemIndex) => {
    const updated = [...tasks];
    updated[sectionIndex].items[itemIndex].checked =
      !updated[sectionIndex].items[itemIndex].checked;
    saveTasks(updated);
  };

  const handleDeleteItem = (sectionIndex, itemIndex) => {
    const updated = [...tasks];
    updated[sectionIndex].items.splice(itemIndex, 1);
    saveTasks(updated);
  };

  const handleDeleteSection = (sectionIndex) => {
    const updated = [...tasks];
    updated.splice(sectionIndex, 1);
    saveTasks(updated);
  };

  const handleAddItem = (sectionIndex, label) => {
    if (!label.trim()) return;
    const updated = [...tasks];
    updated[sectionIndex].items.push({ label: label.trim(), checked: false });
    saveTasks(updated);
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const updated = [...tasks, { title: newSectionTitle.trim(), items: [] }];
    setNewSectionTitle("");
    saveTasks(updated);
  };

  const filteredTasks = tasks
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section, idx) =>
      idx === 0 || search.trim() ? section.items.length > 0 || idx === 0 : true
    );

    

  const handleSave = async (tasks) => {
    const res = await saveTaskToDb(tasks);
    if (res === true) {
      setIsSaved("success");
    } else {
      setIsSaved("error");
    }
    setTimeout(() => setIsSaved(null), 3000); // Hide after 3s
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {isSaved === "success" && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Saved successfully!
        </div>
      )}

      {isSaved === "error" && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Server error. Try again!
        </div>
      )}
      <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-white">
        📝 Smart Checklist
      </h2>

      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredTasks.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No tasks found.
        </div>
      ) : (
        filteredTasks.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className={`font-semibold text-secondary dark:text-white ${sectionIndex === 0 ? "text-3xl" : "text-xl"}`}>
                {section.title}
              </h3>
              {sectionIndex===0 && heading!==section.title && setHeading(section.title)}
              {sectionIndex !== 0 && (
                <button
                  onClick={() => handleDeleteSection(sectionIndex)}
                  title="Delete section"
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  <X size={20} />
                </button>
              )}
              {sectionIndex === 0 && (
                <button
                  onClick={() => handleSave(tasks)}
                  className="shadow-lg rounded-4xl flex items-center justify-center group relative transition-all duration-200 ease-in-out cursor-pointer"
                >
                  <HardDriveUpload className="w-10 h-10 text-green-400" />
                  <span className="absolute bottom-full mb-2 px-3 py-1 bg-gray-700 text-white text-sm rounded-md opacity-0 translate-y-2       group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out ">
                    Upload
                  </span>
                </button>
              )}
            </div>

            <ul className="p-4 space-y-3">
              {section.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex justify-between items-center group"
                >
                  <label className="flex items-start gap-3 text-gray-800 dark:text-white">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggle(sectionIndex, itemIndex)}
                      className="mt-1 w-5 h-5 "
                    />
                    <span
                      className={`transition-all ${
                        item.checked
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteItem(sectionIndex, itemIndex)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-opacity opacity-0 group-hover:opacity-100"
                    title="Delete item"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
              {sectionIndex === 0 && section.items.length !== 0 && (
                <AddItemInput onAdd={(label) => handleAddItem(sectionIndex, label)} />
              )}
              {sectionIndex !== 0  && (
                <AddItemInput onAdd={(label) => handleAddItem(sectionIndex, label)} />
              )}
            </ul>
          </div>
        ))
      )}

      <div className="mt-8">
        <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">
          ➕ Add New Section
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none"
            placeholder="Section title..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
          />
          <button
            onClick={handleAddSection}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition bg-green-500"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddItemInput = ({ onAdd }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        placeholder="Add new item..."
        className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default ChecklistViewer;

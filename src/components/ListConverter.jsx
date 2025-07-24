import React, { useEffect, useState, useRef } from "react";
import {
  Trash2,
  Plus,
  X,
  Save,
  GripVertical,
  LoaderCircle,
  Pencil,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import auth from "../config/config";
import saveTaskToDb from "../api/saveTask";

const LOCAL_STORAGE_KEY = auth.local_Storage.currentStorageKey;

const ensureIds = (taskData) =>
  taskData.map((section, index) => ({
    ...section,
    id: section.id || `section-${Date.now()}-${index}`,
    items: section.items.map((item, itemIndex) => ({
      ...item,
      id: item.id || `item-${Date.now()}-${index}-${itemIndex}`,
    })),
  }));

const ChecklistViewer = ({ data, selfTask = false, mainTitle }) => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isSaved, setIsSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dbTaskId, setDbTaskId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    if (selfTask) {
      setTasks(ensureIds([{ title: "My New Checklist", items: [] }]));
    } else if (data?.length) {
      const tasksWithIds = ensureIds(data);
      setTasks(tasksWithIds);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ id: null, task_data: tasksWithIds })
      );
    } else {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const storedData = JSON.parse(stored);
        const storedTasks = storedData.task_data || [];
        setDbTaskId(storedData.id || null);
        setTasks(
          ensureIds(
            storedTasks.length > 0
              ? storedTasks
              : [{ title: "My Checklist", items: [] }]
          )
        );
      }
    }
  }, [data, selfTask]);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    if (!selfTask) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ id: dbTaskId, task_data: updatedTasks })
      );
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    let updatedTasks = Array.from(tasks);
    if (type === "section") {
      const [reorderedSection] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, reorderedSection);
    } else {
      const sourceSection = updatedTasks.find(
        (t) => t.id === source.droppableId
      );
      const destSection = updatedTasks.find(
        (t) => t.id === destination.droppableId
      );
      const [movedItem] = sourceSection.items.splice(source.index, 1);
      destSection.items.splice(destination.index, 0, movedItem);
    }
    saveTasks(updatedTasks);
  };

  const handleUpdateSectionTitle = (sectionId, newTitle) => {
    setEditingSectionId(null);
    const updatedTasks = tasks.map((section) => {
      if (section.id === sectionId) {
        return { ...section, title: newTitle.trim() || section.title };
      }
      return section;
    });
    saveTasks(updatedTasks);
  };

  const handleUpdateItemLabel = (sectionId, itemId, newLabel) => {
    setEditingItemId(null); // Exit editing mode for this item
    const updatedTasks = tasks.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId
              ? { ...item, label: newLabel.trim() || item.label } // Revert if empty, else update
              : item
          ),
        };
      }
      return section;
    });
    saveTasks(updatedTasks);
  };

  const handleToggle = (sectionId, itemId) => {
    const updated = tasks.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      }
      return section;
    });
    saveTasks(updated);
  };

  const handleDeleteItem = (sectionId, itemId) => {
    const updated = tasks.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter((item) => item.id !== itemId),
        };
      }
      return section;
    });
    saveTasks(updated);
  };

  const handleDeleteSection = (sectionId) => {
    if (
      window.confirm("Are you sure you want to delete this entire section?")
    ) {
      const updated = tasks.filter((section) => section.id !== sectionId);
      saveTasks(updated);
    }
  };

  const handleAddItem = (sectionId, label) => {
    if (!label.trim()) return;
    const updated = tasks.map((section) => {
      if (section.id === sectionId) {
        const newItem = {
          id: `item-${Date.now()}`,
          label: label.trim(),
          checked: false,
        };
        return { ...section, items: [...section.items, newItem] };
      }
      return section;
    });
    saveTasks(updated);
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection = {
      id: `section-${Date.now()}`,
      title: newSectionTitle.trim(),
      items: [],
    };
    saveTasks([...tasks, newSection]);
    setNewSectionTitle("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const cleanTasks = tasks.map(({ id, ...section }) => ({
      ...section,
      items: section.items.map(({ id, ...item }) => item),
    }));

    const res = await saveTaskToDb([
      {
        id: dbTaskId,
        title: cleanTasks[0].title,
        task_data: cleanTasks,
      },
    ]);

    setIsSaving(false);
    if (res.status === true) {
      if (res.statusCode === 200) setIsSaved("success");
      if (res.statusCode === 208) setIsSaved("alreadySaved");
    } else {
      setIsSaved("error");
    }
    setTimeout(() => setIsSaved(null), 3000);
  };

  const filteredTasks = tasks
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => search.trim() === "" || section.items.length > 0);

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      {isSaved === "success" && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down">
          Saved successfully!
        </div>
      )}
      {isSaved === "error" && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down">
          Server error. Try again!
        </div>
      )}
      {isSaved === "alreadySaved" && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-down">
          Already saved. No changes made.
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-center text-primary dark:text-white">
        📝 {tasks[0]?.title || mainTitle || "Smart Checklist"}
      </h2>
      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-sections"
          direction="vertical"
          type="section"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {filteredTasks.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                  isDragDisabled={index === 0}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`rounded-xl border transition-shadow duration-300 ${
                        snapshot.isDragging ? "shadow-2xl" : "shadow-md"
                      } ${
                        index === 0
                          ? "border-primary/30"
                          : "border-gray-200 dark:border-gray-700"
                      } bg-white dark:bg-gray-800`}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                        {index !== 0 && (
                          <div
                            {...provided.dragHandleProps}
                            title="Drag to reorder section"
                            className="cursor-grab text-gray-400 hover:text-primary pr-2"
                          >
                            <GripVertical size={20} />
                          </div>
                        )}
                        {editingSectionId === section.id ? (
                          <input
                            type="text"
                            defaultValue={section.title}
                            onBlur={(e) =>
                              handleUpdateSectionTitle(
                                section.id,
                                e.target.value
                              )
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleUpdateSectionTitle(
                                  section.id,
                                  e.target.value
                                );
                            }}
                            className={`w-full font-semibold bg-transparent border-b-2 border-primary dark:text-white focus:outline-none ${
                              index === 0 ? "text-2xl md:text-3xl" : "text-xl"
                            }`}
                            autoFocus
                          />
                        ) : (
                          <h3
                            className={`w-full font-semibold text-secondary dark:text-white ${
                              index === 0 ? "text-2xl md:text-3xl" : "text-xl"
                            } cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-1 -ml-1`}
                            onClick={() => setEditingSectionId(section.id)}
                          >
                            {section.title}
                          </h3>
                        )}
                        <div className="flex items-center gap-2 pl-2">
                          {index !== 0 && (
                            <button
                              onClick={() => handleDeleteSection(section.id)}
                              title="Delete section"
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                            >
                              <X size={20} />
                            </button>
                          )}
                          {index === 0 && (
                            <button
                              onClick={handleSave}
                              disabled={isSaving}
                              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                            >
                              {isSaving ? (
                                <>
                                  <LoaderCircle
                                    size={18}
                                    className="animate-spin"
                                  />{" "}
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save size={18} /> Save
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <Droppable droppableId={section.id} type="item">
                        {(provided) => (
                          <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="p-4 space-y-3"
                          >
                            {index !== 0 && (
                              <>
                                {section.items.map((item, itemIndex) => (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={itemIndex}
                                  >
                                    {(provided, snapshot) => (
                                      <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`flex items-center group p-2 rounded-lg transition-all duration-300 ${
                                          snapshot.isDragging
                                            ? "shadow-lg bg-blue-50 dark:bg-blue-900/50"
                                            : "bg-slate-50 dark:bg-gray-700"
                                        }`}
                                      >
                                        <div
                                          {...provided.dragHandleProps}
                                          title="Drag to reorder item"
                                          className="cursor-grab text-gray-400 hover:text-primary p-1 mr-1"
                                        >
                                          <GripVertical size={20} />
                                        </div>

                                        <div className="flex-grow flex items-center gap-3">
                                          <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() =>
                                              handleToggle(section.id, item.id)
                                            }
                                            className="w-5 h-5 rounded-sm flex-shrink-0"
                                          />
                                          {editingItemId === item.id ? (
                                            <input
                                              type="text"
                                              defaultValue={item.label}
                                              className="w-full bg-transparent text-gray-800 dark:text-white border-b border-primary focus:outline-none"
                                              onBlur={(e) =>
                                                handleUpdateItemLabel(
                                                  section.id,
                                                  item.id,
                                                  e.target.value
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                  handleUpdateItemLabel(
                                                    section.id,
                                                    item.id,
                                                    e.target.value
                                                  );
                                                if (e.key === "Escape")
                                                  setEditingItemId(null);
                                              }}
                                              autoFocus
                                            />
                                          ) : (
                                            <span
                                              className={`flex-grow cursor-pointer ${
                                                item.checked
                                                  ? "line-through text-gray-400 dark:text-gray-500"
                                                  : "text-gray-800 dark:text-white"
                                              }`}
                                              onClick={() =>
                                                setEditingItemId(item.id)
                                              }
                                            >
                                              {item.label}
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex gap-1 items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            onClick={() =>
                                              setEditingItemId(item.id)
                                            }
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                            title="Edit item"
                                          >
                                            <Pencil size={18} />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteItem(
                                                section.id,
                                                item.id
                                              )
                                            }
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
                                            title="Delete item"
                                          >
                                            <Trash2 size={18} />
                                          </button>
                                        </div>
                                      </li>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                                {section.items.length === 0 && (
                                  <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-2">
                                    No tasks here. Add one below!
                                  </p>
                                )}
                                <AddItemInput
                                  onAdd={(label) =>
                                    handleAddItem(section.id, label)
                                  }
                                />
                              </>
                            )}
                          </ul>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">
          ➕ Add New Section
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="New section title..."
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
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setIsAdding(false);
      return;
    }
    onAdd(text);
    setText("");
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    if (!text.trim()) {
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 w-full text-left text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors"
      >
        <Plus size={16} /> Add item
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="What needs to be done?"
        className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsAdding(false);
        }}
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
      >
        Add
      </button>
    </form>
  );
};

export default ChecklistViewer;

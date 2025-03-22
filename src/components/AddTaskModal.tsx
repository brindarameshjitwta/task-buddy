import React, { useState, useEffect, useRef } from "react";

interface TaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onAddTask: (newTask: any) => Promise<void>;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, closeModal, onAddTask }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    status: "",
    attachment: null as File | null,
  });

  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTask({
        title: "",
        description: "",
        category: "",
        dueDate: "",
        status: "",
        attachment: null,
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (category: string) => {
    setTask({ ...task, category });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTask({ ...task, attachment: e.target.files[0] });
    }
  };

  const handleDescriptionChange = () => {
    if (descriptionRef.current) {
      const cleanText = descriptionRef.current.innerHTML.trim();
      setTask({ ...task, description: cleanText });
    }
  };

  const handleFormat = (command: string) => {
    if (descriptionRef.current) {
      if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
        document.execCommand(command, false);
        descriptionRef.current.focus();
      } else {
        document.execCommand(command, false);
      }
      handleDescriptionChange();  // Update description after change
    }
  };

  const submitForm = async (e: any) => {
     const createdAt = new Date().toLocaleString();
    e.preventDefault();
    const newJob = {
      taskName: task.title,
      taskDescription: task.description,
      taskCategory: task.category,
      dueOn: task.dueDate,
      taskStatus: task.status,
      attachment: task.attachment ? await convertFileToBase64(task.attachment) : null,
      createdAt,
    
    };
    onAddTask(newJob);
    closeModal();
   
  };

const convertFileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
  const isFormValid = () => {
    return (
      task.title.trim() !== "" &&
      task.category.trim() !== "" &&
      task.dueDate.trim() !== "" &&
      task.status.trim() !== ""
    );
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
  <div className="bg-white p-8 rounded-lg shadow-lg w-[700px] max-w-full overflow-hidden">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-lg font-medium text-gray-700">Create Task</h2>
      <button onClick={closeModal} className="text-gray-500 text-xl">×</button>
    </div>

    <form onSubmit={submitForm} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div>
        <label htmlFor="taskName" className="block mb-1 text-sm font-medium text-gray-600">Task Title*</label>
        <input
          id="taskName"
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className="border px-3 py-2 w-full rounded-md text-sm shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">Description</label>
        <div className="border p-3 w-full rounded-md shadow-sm relative">
          <div className="flex gap-3 text-gray-600 mb-2">
            <button type="button" onClick={() => handleFormat("bold")} className="text-black font-bold">B</button>
            <button type="button" onClick={() => handleFormat("italic")} className="italic">I</button>
            <button type="button" onClick={() => handleFormat("strikethrough")} className="line-through">S</button>
            <span className="border-l h-5 mx-2"></span>
            <button type="button" onClick={() => handleFormat("insertUnorderedList")} className="text-sm">• List</button>
            <button type="button" onClick={() => handleFormat("insertOrderedList")} className="text-sm">1. List</button>
          </div>

          <style>{`
            [contenteditable="true"] ul {
              list-style-type: disc;
              margin-left: 20px;
            }
            [contenteditable="true"] ol {
              list-style-type: decimal;
              margin-left: 20px;
            }
          `}</style>

          <div
            ref={descriptionRef}
            contentEditable={true}
            translate="no"
            className="min-h-[80px] max-w-full overflow-y-auto rounded-lg px-[3px] py-1 focus:outline-none"
            onInput={handleDescriptionChange}
            tabIndex={0}
          ></div>

          <div className="text-right text-gray-500 text-sm">
                  {descriptionRef.current && descriptionRef.current.innerText.trim() === "" 
                    ? 0 
                    : descriptionRef.current?.innerText.length
                  }/300 characters
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Task Category*</label>
          <div className="flex gap-3">
            <button type="button" className={`px-4 py-2 rounded-full border text-sm ${task.category === "WORK" ? "bg-gray-200" : ""}`} onClick={() => handleCategorySelect("WORK")}>WORK</button>
            <button type="button" className={`px-4 py-2 rounded-full border text-sm ${task.category === "PERSONAL" ? "bg-gray-200" : ""}`} onClick={() => handleCategorySelect("PERSONAL")}>PERSONAL</button>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Due Date*</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded-md text-sm shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Task Status*</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded-full text-sm shadow-sm appearance-none"
            required
          >
            <option value="">Choose</option>
            <option value="TO-DO">TO-DO</option>
            <option value="IN-PROGRESS">IN-PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Attach File</label>
          <input
            type="file"
            name="attachment"
            onChange={handleFileChange}
            className="border px-3 py-2 w-full rounded-md text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 text-gray-600 border rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`bg-purple-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-purple-600 transition ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Add Task
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default TaskModal;
     
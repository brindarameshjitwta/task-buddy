import React, { useState, useRef, useEffect } from 'react';
import { updateTask } from '../jsonService';

interface EditTaskModalProps {
  task: any;
  onClose: () => void;
  onUpdate: (updatedTask: any) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onUpdate }) => {
  const [updatedTask, setUpdatedTask] = useState({
    taskName: task?.taskName || '',
    description: task?.taskDescription || '',
    taskCategory: task?.taskCategory || '',
    dueOn: task?.dueOn || '',
    taskStatus: task?.taskStatus || 'TO-DO',
    createdAt: task?.createdAt,
    attachment: task?.attachment || null,
  });

  const [activeTab, setActiveTab] = React.useState<'DETAILS' | 'ACTIVITY'>('DETAILS');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activityLog, setActivityLog] = useState(task?.activityLog || []);
 
  const descriptionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = updatedTask.description || '';
    }
  }, [updatedTask.description]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!task?.activityLog) {
      const creationLog = `Task created on ${formattedDate}`;
      setActivityLog([creationLog]);
    }
  }, [task]);

  const formatDateTime = (date: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const formattedDate = new Date(date).toLocaleString('en-GB', options);
    return formattedDate.replace(",", " at");
  };

  const formattedDate = formatDateTime(task.createdAt);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUpdatedTask((prev) => ({ ...prev, [name]: value }));

    if (name === 'taskStatus' && task.taskStatus !== value) {
      const statusChangeLog = `Status changed from ${task.taskStatus} to ${value} on ${new Date().toLocaleString('en-US', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', hour12: true })}`;
      setActivityLog((prev: any) => [...prev, statusChangeLog]);
    }
  };

  const handleFileClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileBase64 = await convertFileToBase64(file);
      setUpdatedTask((prevState) => ({
        ...prevState,
        attachment: fileBase64,
      }));
      const attachmentChangeLog = `Attachment uploaded on ${new Date().toLocaleString('en-US', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', hour12: true })}`;
      setActivityLog((prev: any) => [...prev, attachmentChangeLog]);
    }
  };

  const handleUpdate = async () => {
    if (!task?.id) {
      console.error('Task ID is missing');
      return;
    }

    handleDescriptionChange();

    const finalTask = { ...task, ...updatedTask };

    try {
      await updateTask(task.id, finalTask);
      onUpdate(finalTask);
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCategoryChange = (category: string) => {
    setUpdatedTask((prev) => ({ ...prev, taskCategory: category.toUpperCase() }));
  };

  const handleDescriptionChange = () => {
    if (descriptionRef.current) {
      setUpdatedTask((prev) => ({
        ...prev,
        taskDescription: descriptionRef.current?.innerText,
      }));
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
      handleDescriptionChange();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg max-h-[80vh] overflow-y-auto">
        {isMobile && (
          <div className="flex mb-4 md:hidden">
            <button
              className={`flex-1 py-2 rounded-l-lg ${activeTab === 'DETAILS' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('DETAILS')}
            >
              DETAILS
            </button>
            <button
              className={`flex-1 py-2 rounded-r-lg ${activeTab === 'ACTIVITY' ? 'bg-black text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('ACTIVITY')}
            >
              ACTIVITY
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(!isMobile || activeTab === 'DETAILS') && (
            <div className="md:col-span-2">
              <input
                name="taskName"
                value={updatedTask.taskName}
                onChange={handleChange}
                className="w-full p-3 mb-4 border rounded-lg text-sm focus:ring-2 focus:ring-purple-400"
                placeholder="Task Name"
              />
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
              <div className="flex flex-wrap gap-4 mt-6 items-center">
                <div>
                  <label className="text-sm block mb-2 font-normal">Task Category*</label>
                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-1 text-sm rounded-full ${updatedTask.taskCategory === 'WORK' ? 'bg-purple-600 text-white' : 'bg-gray-200 border border-gray-400'}`}
                      onClick={() => handleCategoryChange('WORK')}
                    >
                      WORK
                    </button>
                    <button
                      className={`px-4 py-1 text-sm rounded-full ${updatedTask.taskCategory === 'PERSONAL' ? 'bg-purple-600 text-white' : 'bg-gray-200 border border-gray-400'}`}
                      onClick={() => handleCategoryChange('PERSONAL')}
                    >
                      PERSONAL
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm block mb-2 font-normal">Due on*</label>
                  <input
                    type="date"
                    name="dueOn"
                    value={updatedTask.dueOn}
                    onChange={handleChange}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-2 font-normal">Task Status*</label>
                  <select
                    name="taskStatus"
                    value={updatedTask.taskStatus}
                    onChange={handleChange}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="TO-DO">TO-DO</option>
                    <option value="IN-PROGRESS">IN-PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>
              <div className="my-4">
                <label className="text-sm font-normal">Attachment</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-2 text-center cursor-pointer" onClick={handleFileClick}>
                  <p className="text-gray-500">Drop your files here or <span className="text-blue-500">Upload</span></p>
                  <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
                </div>
                {updatedTask.attachment && (
                  <div className="mt-4">
                    <p className="text-sm font-normal">New Attachment Preview:</p>
                    <div className="mt-2 max-w-full max-h-60 overflow-y-auto rounded-md border">
                      {updatedTask.attachment.startsWith('data:image') || updatedTask.attachment.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img
                          src={updatedTask.attachment}
                          alt="New Task Attachment"
                          className="w-full h-auto object-contain"
                        />
                      ) : updatedTask.attachment.match(/\.pdf$/i) ? (
                        <iframe
                          src={updatedTask.attachment}
                          className="w-full h-60"
                          title="New PDF Preview"
                        />
                      ) : (
                        <p className="text-sm text-gray-500">Preview not available for this file type.</p>
                      )}
                    </div>
                  </div>
                )}
                {task?.attachment && !updatedTask.attachment && (
                  <div className="mt-4">
                    <p className="text-sm font-normal">Existing Attachment Preview:</p>
                    <div className="mt-2 max-w-full max-h-60 overflow-y-auto rounded-md border">
                      {task.attachment.startsWith('data:image') || task.attachment.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img
                          src={task.attachment}
                          alt="Task Attachment"
                          className="w-full h-auto object-contain"
                        />
                      ) : task.attachment.match(/\.pdf$/i) ? (
                        <iframe
                          src={task.attachment}
                          className="w-full h-60"
                          title="PDF Preview"
                        />
                      ) : (
                        <p className="text-sm text-gray-500">Preview not available for this file type.</p>
                      )}
                    </div>
                    <button
                      onClick={() => onUpdate({ ...task, attachment: null })}
                      className="mt-4 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Remove Attachment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {(!isMobile || activeTab === 'ACTIVITY') && (
            <div className="md:col-span-1 border-l pl-6">
              <h3 className="font-semibold mb-4 text-gray-700">Activity</h3>
              <ul className="text-sm text-gray-600">
                {activityLog.map((log: any, index: any) => (
                  <li key={index} className="mb-3">{log}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={handleUpdate} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
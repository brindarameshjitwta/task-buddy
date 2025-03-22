TaskBuddy is a responsive task management application developed using React, designed to help users efficiently create, organize, and track their tasks. The application features user authentication via Firebase, allowing seamless Google sign-ins.

**Task List:**
- TaskBuddy offers a task list view where tasks are categorized as TO-DO, IN-PROGRESS, or COMPLETED.
- Users can create, edit, and delete tasks, categorize them (e.g., work, personal), and set due dates.
- The list view supports batch actions like changing the status or deleting multiple tasks using checkboxes.
- Users can drag and drop tasks across different columns to update their status.
- Tasks can be sorted in ascending or descending order based on their due dates.
- Inline task addition is supported for a more efficient task management experience.

**Edit Modal:**
- The edit/view modal allows users to view or edit the details of a selected task.
- Users can track task changes using an activity log that records task creation, status updates, and attachment additions.
- Users can also attach files or documents to tasks for additional context.

**Add Modal:**
- The add modal lets users create new tasks by entering task details such as name, status, category, description, and attachments.
- Mandatory fields are marked with an asterisk (*), and the submit button remains disabled until all required fields are completed.

**Task Board:**
- TaskBuddy features a Kanban-style task board that visually organizes tasks based on their status (TO-DO, IN-PROGRESS, or COMPLETED).
- Users can perform essential actions like creating, editing, and deleting tasks directly from the board.
- Drag-and-drop functionality allows tasks to be moved between columns to update their status.
- Tasks are displayed in order of their due dates for easier prioritization.

**Login Page:**
The login page provides authentication via Firebase

TaskBuddy ensures a seamless and organized task management experience, providing users with greater productivity and clarity in tracking their tasks.

CHALLENGES FACED:
**Improved Drag-and-Drop Functionality:**
- Initially, using `react-dnd` caused issues where tasks would not update correctly in the UI or get duplicated. 
- Additionally, while integrating with APIs, multiple API calls were triggered unnecessarily.
- These issues were resolved by implementing the native HTML5 Drag and Drop API, ensuring smoother task management and minimizing API calls.

TO RUN JSON SERVER:json-server --watch src/db.json --port 8000
INSTALL JSON SERVER:npm install json-server

DEVELOPMENT URL:https://taskbuddyapplication.netlify.app/

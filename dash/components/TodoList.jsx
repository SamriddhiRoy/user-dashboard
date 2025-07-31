import React from 'react';

const todos = [
  {
    id: 1,
    title: 'Submit project report',
    description: 'Finalize and submit the quarterly project report to the manager by...',
    dueDate: '16/08/2023',
    time: '18:00',
    status: 'Completed',
  },
  {
    id: 2,
    title: 'Team stand-up meeting',
    description: 'Attend the daily stand-up meeting with the product team on Zoom',
    dueDate: '16/08/2023',
    time: '18:00',
    status: 'Upcoming',
  },
  {
    id: 3,
    title: 'Client follow-up email',
    description: 'Draft and send the follow-up email to the client regarding the new...',
    dueDate: '16/08/2023',
    time: '18:00',
    status: 'Upcoming',
  },
  {
    id: 4,
    title: 'Review pull requests',
    description: 'Check and review the pending pull requests on GitHub before EOD.',
    dueDate: '16/08/2023',
    time: '18:00',
    status: 'Completed',
  },
  {
    id: 5,
    title: 'Buy groceries',
    description: 'Pick up essentials like vegetables, milk, and bread from the nearby...',
    dueDate: '16/08/2023',
    time: '18:00',
    status: 'Upcoming',
  },
  {
    id: 6,
    title: 'Workout session',
    description: 'Attend the 1-hour virtual HIIT workout class scheduled',
    dueDate: '16/08/2023',
    time: '18:00',
    status: 'Completed',
  },
];

const TodoList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header and Controls */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">All Todos</h2>
          <p className="text-sm text-gray-500">Last Updated : 16/08/2023 18:00</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200">
            {/* Filter Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V19l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200">
            {/* Add Todo Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Todo
          </button>
        </div>
      </div>

      {/* Todo List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Todo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
                {/* Sort Icon (up/down arrow) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block ml-1 align-text-bottom"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
                {/* Sort Icon (up/down arrow) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block ml-1 align-text-bottom"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{todo.title}</div>
                  <div className="text-sm text-gray-500 max-w-sm truncate">
                    {todo.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{todo.dueDate}</div>
                  <div className="text-sm text-gray-500">{todo.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      todo.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {todo.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    {/* Edit Button with custom styling */}
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 stroke-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    {/* Delete Button with custom styling */}
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 stroke-pink-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;
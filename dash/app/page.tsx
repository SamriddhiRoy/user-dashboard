'use client'

import Head from 'next/head';
import TodoList from '../components/TodoList'; // Adjust path if needed

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Fawaz's Dashboard</title>
        <meta name="description" content="A dashboard built with Next.js and Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto">
        {/* Top Header Section (Hello, Fawaz) */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hello, Fawaz 👋</h1>
          <p className="text-sm text-gray-500">Last Login Time : 16/08/2023 18:00</p>
        </div>

        {/* Overview Cards - Refined for closer match to image_4dbfe0.png */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-normal text-gray-500 mb-0">All Todos</h3> {/* Added mb-0 for no margin */}
            <p className="text-4xl font-bold text-gray-800 leading-none">12</p> {/* Increased to text-4xl, added leading-none */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-normal text-gray-500 mb-0">Upcoming</h3> {/* Added mb-0 for no margin */}
            <p className="text-4xl font-bold text-gray-800 leading-none">4</p> {/* Increased to text-4xl, added leading-none */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-normal text-gray-500 mb-0">Completed</h3> {/* Added mb-0 for no margin */}
            <p className="text-4xl font-bold text-gray-800 leading-none">6</p> {/* Increased to text-4xl, added leading-none */}
          </div>
        </div>

        {/* Todo List Section */}
        <TodoList 
          todos={[]} 
          onEdit={() => {}} 
          onDelete={() => {}} 
          onToggleComplete={() => {}} 
        />
      </main>
    </div>
  );
}
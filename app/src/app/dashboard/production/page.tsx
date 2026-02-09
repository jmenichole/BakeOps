'use client';

import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Clock,
  ClipboardList
} from 'lucide-react';

export default function ProductionPage() {
  const [selectedDay, setSelectedDay] = useState('Wednesday');

  const weekDays = [
    { name: 'Mon', date: 'Feb 10', tasks: 2 },
    { name: 'Tue', date: 'Feb 11', tasks: 4 },
    { name: 'Wed', date: 'Feb 12', tasks: 8, isToday: true },
    { name: 'Thu', date: 'Feb 13', tasks: 5 },
    { name: 'Fri', date: 'Feb 14', tasks: 12 },
    { name: 'Sat', date: 'Feb 15', tasks: 15 },
    { name: 'Sun', date: 'Feb 16', tasks: 0 },
  ];

  const tasks = [
    { id: 1, title: 'Bake Red Velvet Layers', order: '#ORD-102', time: '09:00 AM', category: 'Baking', status: 'completed' },
    { id: 2, title: 'Prepare Strawberry Filling', order: '#ORD-102', time: '10:30 AM', category: 'Filling', status: 'in-progress' },
    { id: 3, title: 'Crumb Coat Floral Cake', order: '#ORD-101', time: '11:00 AM', category: 'Coating', status: 'todo' },
    { id: 4, title: 'Make Fondant Decorations', order: '#ORD-103', time: '01:00 PM', category: 'Fondant', status: 'todo' },
    { id: 5, title: 'Batch: Vanilla Buttercream (5lbs)', order: 'Multiple', time: '02:30 PM', category: 'Prep', status: 'todo' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Production Planner</h1>
          <p className="text-gray-500 mt-1">Manage your weekly prep and baking schedule.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <button className="p-2 hover:bg-gray-50 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-bold px-4">Feb 10 - Feb 16, 2025</span>
          <button className="p-2 hover:bg-gray-50 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Week View Selector */}
      <div className="grid grid-cols-7 gap-2 mb-10">
        {weekDays.map((day) => (
          <button
            key={day.name}
            onClick={() => setSelectedDay(day.name)}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
              selectedDay === day.name 
                ? 'border-primary bg-pink-50 text-primary shadow-sm' 
                : 'border-white bg-white text-gray-400 hover:border-pink-100'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">{day.name}</span>
            <span className="text-lg font-black">{day.date.split(' ')[1]}</span>
            {day.tasks > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                selectedDay === day.name ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {day.tasks} tasks
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Tasks for {selectedDay}
              </h2>
              <div className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                3/8 Completed
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                  <button className="mt-1">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                    ) : task.status === 'in-progress' ? (
                      <div className="w-6 h-6 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-200" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-primary font-bold">{task.order}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Totals / Tips */}
        <div className="space-y-6">
          <div className="bg-secondary text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ClipboardList className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-bold mb-6">Ingredient Batches</h3>
            <div className="space-y-4">
              <BatchItem label="Vanilla Buttercream" amount="12.5 lbs" />
              <BatchItem label="Red Velvet Batter" amount="3 batches" />
              <BatchItem label="Strawberry Compote" amount="4 cups" />
              <BatchItem label="White Fondant" amount="8 lbs" />
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
              View Shopping List
            </button>
          </div>

          <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
            <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span> Pro Tip
            </h4>
            <p className="text-sm text-pink-800 leading-relaxed">
              Friday has 12 deliveries. We recommend starting your final decorations on Thursday evening to stay ahead of schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatchItem({ label, amount }: { label: string, amount: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-3">
      <span className="text-sm text-white/70">{label}</span>
      <span className="font-bold">{amount}</span>
    </div>
  );
}

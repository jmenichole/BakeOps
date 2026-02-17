'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Clock,
  ClipboardList
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';

export default function ProductionPage() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  const getWeekDays = (start: Date) => {
    const days = [];
    const curr = new Date(start);
    curr.setDate(curr.getDate() - curr.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDay);

  useEffect(() => {
    async function fetchTasks() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfDay = new Date(selectedDay);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDay);
      endOfDay.setHours(23, 59, 59, 999);

      const { data } = await supabase
        .from('prep_tasks')
        .select('*')
        .eq('baker_id', user.id)
        .gte('scheduled_for', startOfDay.toISOString())
        .lte('scheduled_for', endOfDay.toISOString())
        .order('scheduled_for', { ascending: true });

      setTasks(data || []);
      setLoading(false);
    }
    fetchTasks();
  }, [selectedDay, supabase]);

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    const { error } = await supabase
      .from('prep_tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (!error) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Production Planner</h1>
          <p className="text-gray-500 mt-1">Manage your weekly prep and baking schedule.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <button 
            onClick={() => {
              const d = new Date(selectedDay);
              d.setDate(d.getDate() - 7);
              setSelectedDay(d);
            }}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold px-4 text-center min-w-[180px]">
            {weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <button 
            onClick={() => {
              const d = new Date(selectedDay);
              d.setDate(d.getDate() + 7);
              setSelectedDay(d);
            }}
            className="p-2 hover:bg-gray-50 rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-10">
        {weekDays.map((day) => {
          const isSelected = day.toDateString() === selectedDay.toDateString();
          const isToday = day.toDateString() === new Date().toDateString();
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                isSelected
                  ? 'border-primary bg-pink-50 text-primary shadow-sm' 
                  : 'border-white bg-white text-gray-400 hover:border-pink-100'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                {day.toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
              <span className="text-lg font-black">{day.getDate()}</span>
              {isToday && (
                <span className="text-[8px] bg-primary text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Today</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Tasks for {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </h2>
              <div className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                {tasks.filter(t => t.status === 'completed').length}/{tasks.length} Completed
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-12 text-center text-gray-400">Loading your tasks...</div>
              ) : tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                    <button className="mt-1" onClick={() => toggleTaskStatus(task.id, task.status)}>
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
                          <Clock className="w-3 h-3" /> {new Date(task.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-primary font-bold">#{task.order_id?.slice(0, 8)}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-gray-50 m-6 rounded-3xl">
                  <p className="text-gray-400 font-medium">No tasks scheduled for this day.</p>
                  <button className="text-primary text-sm font-bold mt-2">Add task manually +</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ClipboardList className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-bold mb-6">Ingredient Batches</h3>
            <div className="space-y-4">
              <p className="text-xs text-white/50 italic leading-relaxed">
                Connect your orders to automatically calculate ingredient totals for the week.
              </p>
              <BatchItem label="Vanilla Buttercream" amount="0 lbs" />
              <BatchItem label="Standard Cake Batter" amount="0 batches" />
            </div>
          </div>

          <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
            <h4 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span> Beta Tip
            </h4>
            <p className="text-sm text-pink-800 leading-relaxed">
              Use the "Create Design" flow to automatically generate production tasks based on cake complexity!
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

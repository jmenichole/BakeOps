'use client';
// (c) jmenichole

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  ClipboardList,
  Plus,
  X,
  Save,
  Calendar,
  AlertCircle,
  Truck
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import { toast } from '@/hooks/useToast';

// Pre-made task templates for Quick Add
const QUICK_ADD_TASKS = [
  { title: 'Mix Cake Batter', category: 'Baking' },
  { title: 'Bake Cake Layers', category: 'Baking' },
  { title: 'Make Buttercream', category: 'Decoration' },
  { title: 'Prepare Fillings', category: 'Assembly' },
  { title: 'Cool Cake Layers', category: 'Baking' },
  { title: 'Level Cake Layers', category: 'Assembly' },
  { title: 'Crumb Coat', category: 'Decoration' },
  { title: 'Final Frosting', category: 'Decoration' },
  { title: 'Fondant Covering', category: 'Decoration' },
  { title: 'Decorate Cake', category: 'Decoration' },
  { title: 'Add Fresh Flowers', category: 'Decoration' },
  { title: 'Box Cake', category: 'Packaging' },
  { title: 'Prepare Delivery', category: 'Delivery' },
];

export default function ProductionPage() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [quickAddTask, setQuickAddTask] = useState<{ title: string, category: string } | null>(null);
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

  // Fetch orders for sidebar
  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('orders')
        .select('*, cake_designs(title)')
        .eq('baker_id', user.id)
        .in('status', ['confirmed', 'preparing', 'ready'])
        .gte('delivery_date', new Date().toISOString())
        .order('delivery_date', { ascending: true })
        .limit(10);

      setOrders(data || []);
    }
    fetchOrders();
  }, [supabase]);

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

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddingTask(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const time = formData.get('time') as string;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to add tasks');
        return;
      }

      // Combine selected day with the time
      const scheduledFor = new Date(selectedDay);
      const [hours, minutes] = time.split(':').map(Number);
      scheduledFor.setHours(hours, minutes, 0, 0);

      const { error } = await supabase
        .from('prep_tasks')
        .insert({
          baker_id: user.id,
          title,
          category,
          scheduled_for: scheduledFor.toISOString(),
          status: 'todo'
        });

      if (error) throw error;

      // Refresh tasks
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
      setShowAddModal(false);
    } catch (err: any) {
      console.error('Error adding task:', err);
      toast.error('Error adding task: ' + err.message);
    } finally {
      setAddingTask(false);
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
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${isSelected
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
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="text-primary text-sm font-bold mt-2 hover:underline"
                  >
                    Add task manually +
                  </button>
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
              Use the &quot;Create Design&quot; flow to automatically generate production tasks based on cake complexity!
            </p>
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        isLoading={addingTask}
        selectedDay={selectedDay}
      />
    </div>
  );
}

// Add Task Modal Component
function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  selectedDay
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  selectedDay: Date;
}) {
  if (!isOpen) return null;

  const categories = ['Baking', 'Decoration', 'Assembly', 'Packaging', 'Delivery', 'Other'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add Task Manually
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Adding task for {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Task Title</label>
            <input
              required
              name="title"
              type="text"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="e.g., Prepare buttercream frosting"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
            <select
              name="category"
              required
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Time</label>
            <input
              required
              name="time"
              type="time"
              className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              defaultValue="09:00"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Add Task
                </>
              )}
            </button>
          </div>
        </form>
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

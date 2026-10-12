
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  CalendarDays,
  ListTodo,
  Sparkles,
  Clock3,
  Target,
  Heart,
  RefreshCw,
  X,
  Candy,
  Flower2,
  PartyPopper,
} from "lucide-react";
import API from "./api";

const initialForm = {
  title: "",
  description: "",
  priority: "Medium",
  category: "Personal",
  dueDate: "",
};

const priorityStyles = {
  Low: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Medium: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  High: "bg-pink-100 text-pink-700 ring-1 ring-pink-200",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setError(
        "Couldn't connect to the server. Check MongoDB and your backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const filteredTasks = useMemo(() => {
    if (filter === "Active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "Completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function addTask(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    setSaving(true);
    setError("");

    try {
      const response = await API.post("/tasks", {
        ...form,
        title: form.title.trim(),
        dueDate: form.dueDate || null,
      });

      setTasks((previous) => [response.data, ...previous]);
      setForm(initialForm);
      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't create your task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task) {
    setError("");

    try {
      const response = await API.patch(
        `/tasks/${task._id}`,
        { completed: !task.completed }
      );

      setTasks((previous) =>
        previous.map((item) =>
          item._id === task._id ? response.data : item
        )
      );
    } catch (err) {
      setError("Couldn't update this task.");
    }
  }

  async function deleteTask(id) {
    setError("");

    try {
      await API.delete(`/tasks/${id}`);

      setTasks((previous) =>
        previous.filter((task) => task._id !== id)
      );
    } catch (err) {
      setError("Couldn't delete this task.");
    }
  }

  function formatDate(date) {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <main className="candy-page relative min-h-screen overflow-hidden text-slate-800">
      {/* Candy Pop background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="candy-orb candy-orb-pink absolute -left-24 -top-24 h-80 w-80 rounded-full" />
        <div className="candy-orb candy-orb-lilac absolute -right-24 top-24 h-96 w-96 rounded-full" />
        <div className="candy-orb candy-orb-mint absolute -bottom-32 left-1/4 h-96 w-96 rounded-full" />

        <div className="candy-float absolute left-[8%] top-[24%] text-3xl">
          ✦
        </div>
        <div className="candy-float candy-float-delay absolute right-[9%] top-[52%] text-2xl">
          ♡
        </div>
        <div className="candy-float candy-float-slow absolute bottom-[15%] right-[20%] text-3xl">
          ✧
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Navbar */}
        <nav className="mb-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="candy-logo flex h-12 w-12 items-center justify-center rounded-2xl text-white">
              <ListTodo size={25} strokeWidth={2.5} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                Task<span className="candy-gradient-text">Bloom</span>
              </h1>
              <p className="text-xs font-medium text-slate-500">
                Your little productivity garden
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/90 bg-white/75 px-4 py-2.5 text-sm font-bold text-violet-600 shadow-sm backdrop-blur-md sm:flex">
            <Heart
              size={16}
              className="fill-pink-300 text-pink-400"
            />
            One task at a time
            <span>🍬</span>
          </div>
        </nav>

        {/* Welcome section */}
        <section className="mb-10 grid gap-7 md:grid-cols-[1.4fr_0.8fr]">
          <div className="flex flex-col justify-center">
            <div className="candy-badge mb-5 flex w-fit items-center gap-2 rounded-full px-4 py-2.5 text-xs font-black tracking-wide">
              <Sparkles size={15} />
              YOUR HAPPY SPACE
              <span>✨</span>
            </div>

            <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Small steps,
              <br />
              <span className="candy-gradient-text">
                big dreams.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
              Make space for what matters. Organize your day,
              celebrate your progress, and bloom at your own pace.
              <span className="ml-1">🌷</span>
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="candy-primary-button mt-7 flex w-fit items-center gap-2 rounded-2xl px-6 py-3.5 font-extrabold text-white"
            >
              <Plus size={20} />
              Create a task
              <span className="ml-1">✦</span>
            </button>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-pink-400" />
                Plan
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Focus
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Bloom
              </span>
            </div>
          </div>

          {/* Progress card */}
          <div className="candy-panel candy-card-hover rounded-[2rem] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Your daily progress
                </p>
                <h3 className="mt-2 text-4xl font-black tracking-tight">
                  {progress}%
                </h3>
              </div>

              <div className="candy-icon-box flex h-16 w-16 items-center justify-center rounded-2xl text-pink-500">
                <Target size={30} />
              </div>
            </div>

            <div className="candy-progress-track h-3.5 overflow-hidden rounded-full">
              <div
                className="candy-progress-fill h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-500">
                {completedCount} of {tasks.length} completed
              </span>
              <Sparkles size={18} className="text-amber-400" />
            </div>

            <div className="candy-message mt-6 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                {tasks.length > 0 && completedCount === tasks.length ? (
                  <PartyPopper size={18} className="text-pink-500" />
                ) : (
                  <Heart
                    size={18}
                    className="fill-pink-200 text-pink-500"
                  />
                )}

                <p className="text-sm font-extrabold text-violet-700">
                  {tasks.length > 0 && completedCount === tasks.length
                    ? "Amazing! You did it! 🎉"
                    : "You're doing great! 💗"}
                </p>
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                {tasks.length === 0
                  ? "Add your first task and start your journey."
                  : "Every little step counts. Keep going!"}
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<ListTodo size={22} />}
            label="Total tasks"
            value={tasks.length}
            color="stat-lilac"
            decoration="✦"
          />

          <StatCard
            icon={<Clock3 size={22} />}
            label="In progress"
            value={tasks.length - completedCount}
            color="stat-peach"
            decoration="♡"
          />

          <StatCard
            icon={<Check size={22} />}
            label="Completed"
            value={completedCount}
            color="stat-mint"
            decoration="✧"
          />
        </section>

        {/* Task list */}
        <section className="candy-panel rounded-[2rem] p-5 sm:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Flower2 size={19} className="text-pink-500" />
                <span className="text-xs font-black tracking-widest text-pink-500">
                  YOUR LITTLE WINS
                </span>
              </div>

              <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                My tasks <span>🌸</span>
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your plans, all in one happy place.
              </p>
            </div>

            <button
              onClick={fetchTasks}
              title="Refresh tasks"
              disabled={loading}
              className="candy-refresh flex h-11 w-11 items-center justify-center rounded-2xl text-violet-600 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {/* Filters */}
          <div className="mb-7 flex flex-wrap gap-2 rounded-2xl bg-violet-50/70 p-1.5 sm:w-fit">
            {["All", "Active", "Completed"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition-all duration-300 ${
                  filter === item
                    ? "bg-gradient-to-r from-pink-400 to-violet-500 text-white shadow-md shadow-pink-200"
                    : "text-slate-500 hover:bg-white hover:text-violet-600"
                }`}
              >
                {item}
                {item === "All" && (
                  <span className="ml-2 text-xs opacity-80">
                    {tasks.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-pink-100 bg-pink-50 p-4 text-sm text-pink-700"
            >
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
                className="rounded-lg p-1 hover:bg-pink-100"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex flex-col items-center py-16 text-violet-500">
              <RefreshCw className="mb-4 animate-spin" size={32} />
              <p className="text-sm font-bold">
                Gathering your tasks...
              </p>
              <p className="mt-1 text-xs text-slate-400">
                A little moment of magic ✨
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            /* Empty state */
            <div className="candy-empty-state flex flex-col items-center rounded-3xl px-5 py-14 text-center">
              <div className="candy-empty-icon mb-5 flex h-20 w-20 items-center justify-center rounded-[1.8rem] text-4xl">
                {filter === "Completed" ? "🍬" : "🌷"}
              </div>

              <h4 className="text-xl font-black">
                {filter === "Completed"
                  ? "Nothing completed yet"
                  : filter === "Active"
                    ? "All caught up!"
                    : "Your garden is waiting"}
              </h4>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {filter === "Completed"
                  ? "Finish a task and it will bloom here."
                  : filter === "Active"
                    ? "You have no pending tasks. Enjoy your moment!"
                    : "Add your first task and turn your plans into progress."}
              </p>

              {filter !== "Completed" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="candy-primary-button mt-6 rounded-xl px-5 py-3 text-sm font-extrabold text-white"
                >
                  <Plus size={17} className="mr-1 inline" />
                  Add your first task
                </button>
              )}
            </div>
          ) : (
            /* Task cards */
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTasks.map((task, index) => (
                <article
                  key={task._id}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={`candy-task-card candy-enter group rounded-2xl border p-5 ${
                    task.completed
                      ? "candy-task-complete border-emerald-100"
                      : "border-white/90 bg-white/80 hover:border-pink-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task)}
                      title={
                        task.completed
                          ? "Mark as active"
                          : "Mark as completed"
                      }
                      aria-label={
                        task.completed
                          ? "Mark as active"
                          : "Mark as completed"
                      }
                      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-90 ${
                        task.completed
                          ? "border-emerald-400 bg-emerald-400 text-white shadow-md shadow-emerald-100"
                          : "border-violet-200 bg-white text-transparent hover:border-pink-400 hover:bg-pink-50"
                      }`}
                    >
                      <Check size={15} strokeWidth={3} />
                    </button>

                    <div className="min-w-0 flex-1">
                      <h4
                        className={`break-words font-extrabold ${
                          task.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                            priorityStyles[task.priority] ||
                            priorityStyles.Medium
                          }`}
                        >
                          {task.priority || "Medium"}
                        </span>

                        <span className="rounded-full bg-violet-100/80 px-3 py-1.5 text-xs font-bold text-violet-700">
                          {task.category || "Personal"}
                        </span>
                      </div>

                      {task.dueDate && (
                        <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1.5 text-xs font-bold text-sky-600">
                          <CalendarDays size={14} />
                          Due {formatDate(task.dueDate)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTask(task._id)}
                      title="Delete task"
                      aria-label={`Delete ${task.title}`}
                      className="rounded-xl p-2 text-slate-300 transition-all duration-200 hover:rotate-6 hover:bg-pink-100 hover:text-pink-600 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="py-10 text-center">
          <div className="mb-2 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-500">
            Made with
            <Heart
              size={15}
              className="fill-pink-300 text-pink-400"
            />
            and little steps.
          </div>
          <p className="text-xs text-slate-400">
            Keep blooming, one task at a time! 🍬
          </p>
        </footer>
      </div>

      {/* Create task modal */}
      {showForm && (
        <div
          className="candy-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <form
            onSubmit={addTask}
            className="candy-modal my-auto w-full max-w-lg rounded-[2rem] border border-white/80 bg-white p-6 sm:p-8"
          >
            <div className="mb-7 flex items-start justify-between gap-3">
              <div>
                <div className="mb-3 flex items-center gap-2 text-violet-500">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-violet-100">
                    <Candy size={19} />
                  </div>
                  <span className="text-xs font-black tracking-widest">
                    NEW BEGINNING
                  </span>
                </div>

                <h3 className="text-2xl font-black tracking-tight">
                  Create a task
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  One small step towards your goals.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close task form"
                className="rounded-xl bg-slate-50 p-2.5 text-slate-500 transition hover:rotate-90 hover:bg-pink-100 hover:text-pink-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-sm font-extrabold"
                >
                  Task title *
                </label>
                <input
                  id="task-title"
                  autoFocus
                  required
                  maxLength={100}
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  placeholder="e.g. Learn React hooks"
                  className="candy-input w-full rounded-xl border px-4 py-3.5 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="mb-2 block text-sm font-extrabold"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  rows={3}
                  placeholder="Add a little more detail..."
                  className="candy-input w-full resize-none rounded-xl border px-4 py-3.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="task-priority"
                    className="mb-2 block text-sm font-extrabold"
                  >
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    name="priority"
                    value={form.priority}
                    onChange={updateForm}
                    className="candy-input w-full rounded-xl border bg-white px-3 py-3.5 outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="task-category"
                    className="mb-2 block text-sm font-extrabold"
                  >
                    Category
                  </label>
                  <select
                    id="task-category"
                    name="category"
                    value={form.category}
                    onChange={updateForm}
                    className="candy-input w-full rounded-xl border bg-white px-3 py-3.5 outline-none"
                  >
                    <option>Personal</option>
                    <option>Work</option>
                    <option>Study</option>
                    <option>Health</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-2 block text-sm font-extrabold"
                >
                  Due date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={updateForm}
                  className="candy-input w-full rounded-xl border bg-white px-4 py-3.5 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-3.5 font-extrabold text-slate-600 transition hover:bg-slate-200 active:scale-95"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="candy-primary-button flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Plus size={19} />
                )}
                {saving ? "Creating..." : "Create task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function StatCard({ icon, label, value, color, decoration }) {
  return (
    <div className="candy-panel candy-card-hover relative flex items-center gap-4 overflow-hidden rounded-2xl p-5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-2 text-2xl text-violet-200"
      >
        {decoration}
      </span>

      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="mt-1 text-3xl font-black tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

export default App;

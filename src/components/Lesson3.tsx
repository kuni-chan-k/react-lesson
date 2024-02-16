import { useState, useCallback } from 'react';

// レッスン3 Todo
// https://qiita.com/kmmch/items/107bfeb1d316e4702244
function Lesson3() {
  type Task = {
    id: number;
    name: string;
    isCompleted: boolean;
  };
  type TaskItemProps = {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
  };

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Reactの勉強', isCompleted: false },
    { id: 2, name: 'TailwindCSSの練習', isCompleted: false },
  ]);
  const [isViewTodoAddModal, setIsViewTodoAddModal] = useState(false);
  const [inputNewTask, setInputNewTask] = useState("");
  const [hasInputError, setHasInputError] = useState(false);

  // モーダル関連
  const openTodoAddModal = useCallback(() => {
    setIsViewTodoAddModal(true);
  }, []);
  const closeTodoAddModal = useCallback(() => {
    setIsViewTodoAddModal(false);
    setInputNewTask("");
    setHasInputError(false);
  }, []);
  const saveButtonClick = useCallback(() => {
    if (inputNewTask) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: prevTasks.length + 1, name: inputNewTask, isCompleted: false },
      ]);
      setIsViewTodoAddModal(false);
      setInputNewTask("");
    } else {
      setHasInputError(true);
    }
  }, [inputNewTask]);

  // 入力関連
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 変換中でも入力を許可
    if (e.target.value.length <= 100) {
      setInputNewTask(e.target.value);
    }
  };
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    // e.targetをHTMLInputElementとして扱う
    const target = e.target as HTMLInputElement;
    // 変換終了時に文字数をチェックして超過していれば切り詰める
    const trimmedValue = target.value.slice(0, 100);
    setInputNewTask(trimmedValue);
  };

  // リスト関連
  const toggleTask = (id: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };
  const deleteTask = (id: number): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    return (
      <div className="mx-auto flex w-full max-w-screen-md items-center justify-between rounded-2xl bg-white p-8 drop-shadow-md">
        <div className="flex items-center text-xl">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => onToggle(task.id)}
            className="mr-4 size-5"
          />
          <span className={task.isCompleted ? "line-through" : ""}>{task.name}</span>
        </div>
        <button
          onClick={() => onDelete(task.id)}
        >
          <svg className="size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="bg-teal-600">
        <h1 className="p-4 text-center text-xl font-bold text-white">
          Todo List
        </h1>
      </div>

      <div className="mx-auto grid gap-4 p-8">
        {tasks.length === 0 ? (
          <p className="text-center text-xl font-bold">
            Todoは登録されていません
          </p>
        ) : 
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        }

        <div className='flex justify-center gap-6'>
          <button
            className="size-12 rounded-full bg-teal-600 hover:bg-teal-500"
            onClick={openTodoAddModal}
          >
            <span className="text-2xl text-white">+</span>
          </button>
        </div>
      </div>


      {/* modal */}
      <div
        data-view={isViewTodoAddModal}
        className="fixed inset-x-0 top-0 z-50 h-screen max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-neutral-400/50 data-[view=false]:hidden md:inset-0">
        <div className="mx-auto grid h-screen w-full max-w-xl content-center">
          <div className={`${isViewTodoAddModal ? 'animate-fadeIn' : 'animate-fadeOut'} relative rounded-lg bg-white opacity-100 shadow`}>
            {/* modal header */}
            <div className="flex items-center justify-between rounded-t p-4">
              <h3 className="text-xl font-semibold">
                新規登録
              </h3>
              <button
                className="ms-auto inline-flex size-8 items-center justify-center rounded-lg bg-transparent text-sm hover:bg-gray-200 hover:text-gray-900"
                onClick={closeTodoAddModal}
              >
                <svg className="size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* modal content */}
            <div className="px-4 py-0">
              <input
                type="text"
                value={inputNewTask}
                className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="タスク名を入力"
                onChange={handleChange}
                onCompositionEnd={handleCompositionEnd}
              />
              {hasInputError && <span className='text-red-500'>タスク名を入力してください</span>}
            </div>

            {/* modal footer */}
            <div className="flex items-center justify-end gap-2 rounded-t p-4">
              <button
                className="size-12 w-20 rounded-lg bg-teal-600 p-2 hover:bg-teal-500"
                onClick={saveButtonClick}
              >
                <span className="text-white">Save</span>
              </button>
              <button
                className="size-12 w-20 rounded-lg border-2 border-teal-600 bg-white p-2 hover:bg-teal-500/20"
                onClick={closeTodoAddModal}
              >
                <span className="text-teal-600">Close</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Lesson3
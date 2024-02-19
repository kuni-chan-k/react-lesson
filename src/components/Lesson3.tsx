import { useState, useCallback, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor, Modifiers } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

  // タスク名の入力最大値
  const MAXLENGTH = 1000;

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
  const handleModalOutsideClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeTodoAddModal();
    }
  }, [closeTodoAddModal]);

  // 入力関連
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= MAXLENGTH) {
      setInputNewTask(e.target.value);
    }
  };
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const trimmedValue = target.value.slice(0, MAXLENGTH);
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

  // ドラッグ&ドロップ
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const handleDragStart = () => {
    // ドラッグ開始時にページ全体のスクロールを無効化
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none'; // スマホ表示でのスクロールを防ぐ
    document.addEventListener('touchmove', preventTouchMove, { passive: false }); // タッチによるスクロールを防ぐイベントリスナーを追加
  };
  const handleDragEnd = (event: DragEndEvent) => {
    // ドラッグ終了時にスクロールを再有効化
    document.body.style.overflow = '';
    document.body.style.touchAction = ''; // スクロールを再び許可
    document.removeEventListener('touchmove', preventTouchMove); // イベントリスナーを削除
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex));
    }
  };
  const preventTouchMove: (event: TouchEvent) => void = (event) => {
    // タッチによるスクロールを防ぐための関数
    event.preventDefault();
  };
  const restrictToVerticalAxis: Modifiers = [({ transform }) => ({
    // 垂直方向のみへのドラッグを制限
      ...transform,
      x: 0
    }),
  ];


  // タスク(1行表示)
  const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: task.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="mx-auto flex w-full max-w-screen-md cursor-default items-center justify-between overflow-hidden rounded-2xl bg-white p-4 drop-shadow-md md:p-8"
      >
        <div className="mr-4 flex items-center overflow-hidden">
          <button {...listeners} className="shrink-0 cursor-pointer p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="size-8">
              <path d="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z" />
            </svg>
          </button>
          <input
            type="checkbox"
            id={`task-${task.id}`}
            checked={task.isCompleted}
            onChange={() => onToggle(task.id)}
            className="mr-4 size-5 shrink-0"
          />
          <p className={`grow break-all text-xl ${task.isCompleted ? "line-through" : ""}`}>
            {task.name}
          </p>
        </div>
        <button onClick={() => onDelete(task.id)} className="shrink-0 mr-2">
          <svg className="size-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>

    );
  };

  useEffect(() => {
    // モーダル表示時､エスケープキー押下でモーダルを閉じる
    if (!isViewTodoAddModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTodoAddModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeTodoAddModal, isViewTodoAddModal]);

  useEffect(() => {
    // モーダル表示､スクロールロック
    if (isViewTodoAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isViewTodoAddModal]);

  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="bg-teal-600">
        <h1 className="p-4 text-center text-xl font-bold text-white">
          Todo List
        </h1>
      </div>

      <div className="mx-auto grid gap-4 p-4 md:p-8">
        {tasks.length === 0 ? (
          <p className="text-center text-xl font-bold">
            Todoは登録されていません
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={restrictToVerticalAxis}
          >
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

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
        className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-neutral-400/50 data-[view=false]:hidden"
        onClick={handleModalOutsideClick}
      >
        <div className={`${isViewTodoAddModal ? 'animate-fadeIn' : 'animate-fadeOut'} mx-4 w-full max-w-xl rounded-lg bg-white shadow-lg`}>
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
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* modal content */}
          <div className="px-4 py-0">
          <input
            type="text"
            id="newTaskName"
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
  )
}

export default Lesson3
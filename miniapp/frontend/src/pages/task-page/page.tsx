'use client';
import './task_page_styles.css';
import Task from '@/components/task/page';
import { useState, useEffect } from 'react';
import { Toaster, toast } from "sonner";

export default function TaskPage() {
  const [userId, setUserId] = useState<number | undefined>(undefined);

  /* Получаем ID юзера при входе,используем его в компонентах */
  useEffect(() => {
    const { user } = window.Telegram.WebApp.initDataUnsafe;
    if (user && user.id) {
      setUserId(user.id);
    } else {
      toast.error("Error on Telegram side! Try later")
      setUserId(undefined);
    }
  }, []);

  return (
    <main>
      <Toaster position="top-center" richColors />
      <div className="hi-container">
        <h1>Earn more coins!</h1>
        <p className="text-list-of-task">List of tasks</p>
      </div>

      <div className="task-container">
        {userId !== undefined && (
          <>
            <Task
              task_in_db="task1"
              task_name="Telegram"
              task_price={50000}
              url_of_btn="https://t.me/descoin_official"
              user_id={Number(userId)}
            />
          </>
        )}
      </div>
    </main>
  );
}

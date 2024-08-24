'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './clicker-page-styles.css';
import { Toaster, toast } from "sonner";

const limitOfClicks = 10000;

export default function ClickerPage() {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);
  const [limitClicks, setLimitClicks] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  
  /* При заходе в приложение получаем данные пользователя с сервера */
  useEffect(() => {
    const { user } = window.Telegram.WebApp.initDataUnsafe;
    if (user && user.id) {
      setUserId(user.id);

      getDataFromServerById(user.id)
        .then(({ wallet, limit_clicks }) => {
          setBalance(wallet);
          setLimitClicks(limit_clicks);

          const progressPercentage = (limit_clicks / limitOfClicks) * 100;
          setProgress(progressPercentage);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setUserId(undefined);
          setBalance(0);
          setLimitClicks(10000);
          setProgress(0);
          toast.error("Error on server side. Try later");
        });
    } else {
      setUserId(undefined);
      setBalance(0);
      setLimitClicks(10000);
      setProgress(0);
      toast.error("Error on Telegram side! Try later");
    }
  }, []);

  /* Обновляем данные пользователя при выходе с страницы */
  useEffect(() => {
    // Функция для обновления данных на сервере
    const updateUserData = () => {
      if (userId !== undefined && balance !== null && limitClicks !== null) {
        updateDataOnServer(userId, balance, limitClicks);
      }
    };

    // Проверяем, что API доступно
    if (window.Telegram.WebApp) {
      // Подписываемся на событие закрытия приложения
      window.Telegram.WebApp.onEvent('web_app_close', updateUserData);
    }

    return () => {
      // Отписываемся от события при размонтировании компонента
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.offEvent('web_app_close', updateUserData);
      }
    };
  }, [userId, balance, limitClicks]);

  /* Логика кликера */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // анимация
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(()=>{
      card.style.transform = '';
    },100);
    
    if (limitClicks && limitClicks <= 0) {
      toast.error('Limit!');
      return;
    }

    setBalance((prevBalance) => (prevBalance ?? 0) + 1);
    setLimitClicks((prevLimitClicks) => (prevLimitClicks ?? 0) - 1);
  };

  /* Хендлеры */
  async function getDataFromServerById(userId: number) {
    try {
      const response = await fetch(`https://api.descoin-web.online/getInfo/${userId}`);
      const data = await response.json();
      return { wallet: data.wallet, limit_clicks: data.limit_clicks };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async function updateDataOnServer(userId: number, balance: number, limitClicks: number) {
    try {
      await fetch(`https://api.descoin-web.online/updateInfo/${userId}/${balance}/${limitClicks}`);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  return (
    <main>
      <Toaster position="top-center" richColors />
      <div className="progressbar">
        <span className="progress" style={{ width: `${progress}%` }}></span>
        <div id="day_limit_text">DAY LIMIT⛅️</div>
      </div>

      <div id="counter">{balance ?? 0}</div>

      <button id="button" onClick={handleClick}>
      <Image
        src="/images/des_logo_320x320.jpg"
        alt="My Image"
        width={320}
        height={320}
      />
      </button>

      <div id="limit_display">
        {limitClicks}/{limitOfClicks}⚡️
      </div>

      <footer id="footer">
        <a id="footer_text" className="tap_btn" style={{ textDecoration: 'none' }}>
          🪙<br />Tap
        </a>
        <a id="footer_text" href="ref-page" style={{ textDecoration: 'none' }}>
          👨‍💼<br />Ref
        </a>
        <a id="footer_text" href="task-page" style={{ textDecoration: 'none' }}>
          📝<br />Task
        </a>
      </footer>
    </main>
  );
}

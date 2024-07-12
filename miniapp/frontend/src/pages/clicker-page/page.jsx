'use client';
import React, { useState, useEffect } from 'react';
import './clicker-page-styles.css';
import { Toaster, toast } from "sonner";

// test data
const userId=1573326122;
const limitOfClicks=10000;

export default function ClickerPage(){
  const [balance, setBalance] = useState(null);
  const [limitClicks, setLimitClicks] = useState(null);
  const [progress, setProgress] = useState(0);

  /* При заходе юзера в приложение получаем его данные */
  useEffect(() => {
    getDataFromSeverById(userId)
      .then(({ wallet, limit_clicks }) => {
        setBalance(Number(wallet));
        setLimitClicks(limit_clicks);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const progressPercentage = (limitClicks / limitOfClicks) * 100;
    setProgress(progressPercentage);
  }, []);

  /* При выходе юзера сохраняем его данные */
  useEffect(() => {
    if (balance !== null && limitClicks !== null) {
      const handleUnload = () => {
        updateDataOnServer(userId, balance, limitClicks);
      };

      window.addEventListener('beforeunload', handleUnload);

      return () => {
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
  }, [balance, limitClicks]);

  /* Логика кликера */
  const handleClick = () => {
    if (limitClicks <=0) {
      toast.error('Limit!');
      return;
    }
    setBalance(prevBalance => prevBalance + 1);
    setLimitClicks(prevLimitClicks => prevLimitClicks - 1);
  };
  
  /* Обращения к серваку */
  async function getDataFromSeverById(userId) {
    try {
      const response = await fetch(`http://localhost:9000/getInfo/${userId}`);
      const data = await response.json();
      return { wallet: data.wallet, limit_clicks: data.limit_clicks };
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      return { wallet: 0, limit_clicks: 0 };
    }
  }

  async function updateDataOnServer(userId, balance, limitClicks) {
    try {
      const response = await fetch(`http://localhost:9000/updateInfo/${userId}/${balance}/${limitClicks}`);
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
      return null;
    }
  }

  return (
    <main>
      <Toaster position="top-center" richColors />
      <div className="progressbar">
        <span className="progress" style={{ width: `${progress}%` }}></span>
        <div id="day_limit_text">DAY LIMIT⛅</div>
      </div>

      <div id="counter">{balance}</div>

      <button id="button" onClick={handleClick}></button>

      <div id="limit_display">
        {limitClicks}/{limitOfClicks}⚡
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
};

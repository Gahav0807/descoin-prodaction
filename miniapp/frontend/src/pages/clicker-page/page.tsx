'use client';
import React, { useState, useEffect } from 'react';
import './clicker-page-styles.css';
import { Toaster, toast } from "sonner";

const limitOfClicks = 10000;

export default function ClickerPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [limitClicks, setLimitClicks] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const { user } = window.Telegram.WebApp.initDataUnsafe;
    if (user && user.id) {
      setUserId(user.id);

      getDataFromServerById(user.id)
        .then(({ wallet, limit_clicks }) => {
          setBalance(Number(wallet));
          setLimitClicks(limit_clicks);

          const progressPercentage = (limit_clicks / limitOfClicks) * 100;
          setProgress(progressPercentage);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    } else {
      setUserId(undefined);
    }
  }, []);

  useEffect(() => {
    if (balance !== null && limitClicks !== null && userId !== undefined) {
      const handleUnload = () => {
        updateDataOnServer(userId, balance, limitClicks);
      };

      window.addEventListener('beforeunload', handleUnload);

      return () => {
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
  }, [balance, limitClicks, userId]);

  const handleClick = () => {
    if (limitClicks && limitClicks <= 0) {
      toast.error('Limit!');
      return;
    }
    setBalance((prevBalance) => (prevBalance ?? 0) + 1);
    setLimitClicks((prevLimitClicks) => (prevLimitClicks ?? 0) - 1);
  };

  async function getDataFromServerById(userId: number) {
    try {
      const response = await fetch(`http://localhost:9000/getInfo/${userId}`);
      const data = await response.json();
      return { wallet: data.wallet, limit_clicks: data.limit_clicks };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { wallet: 0, limit_clicks: 0 };
    }
  }

  async function updateDataOnServer(userId: number, balance: number, limitClicks: number) {
    try {
      await fetch(`http://localhost:9000/updateInfo/${userId}/${balance}/${limitClicks}`);
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

      <button id="button" onClick={handleClick}></button>

      <div id="limit_display">
        {limitClicks ?? 0}/{limitOfClicks}⚡️
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

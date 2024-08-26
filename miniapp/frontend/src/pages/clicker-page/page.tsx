'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import './clicker-page-styles.css';
import { Toaster, toast } from "sonner";

const limitOfClicks = 1000;

export default function ClickerPage() {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);
  const [limitClicks, setLimitClicks] = useState<number | null>(null);
  const [currentClicks, setCurrentClicks] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const updateUserDataTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter()
  
  /* При заходе в приложение получаем данные пользователя с сервера */
  useEffect(() => {
    let tg  = window.Telegram.WebApp;
    const platform = tg.platform;

    if (platform === 'android' || platform === 'ios') {
      const { user } = tg.initDataUnsafe;
      if (user && user.id) {
        setUserId(user.id);

        getDataFromServerById(user.id)
          .then(({ wallet, limit_clicks }) => {
            setBalance(wallet);
            setLimitClicks(limit_clicks);

            const progressPercentage = (limit_clicks / limitOfClicks) * 100;
            setProgress(progressPercentage);

            tg.expand()
            tg.enableClosingConfirmation();
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setUserId(undefined);
            setBalance(0);
            setLimitClicks(1000);
            setProgress(0);
            toast.error("Error on server side. Try later");
          });
      } else {
        setUserId(undefined);
        setBalance(0);
        setLimitClicks(1000);
        setProgress(0);
        toast.error("Error on Telegram side! Try later");
      }
  } else {
    router.push('/error-page')
  }
  }, [router]);

  const updateUserData = useCallback(async () => {
    if (userId !== undefined && balance !== null && limitClicks !== null) {
      try {
        await updateDataOnServer(userId, balance, limitClicks);
        setCurrentClicks(0);
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }
  }, [userId, balance, limitClicks]);

  useEffect(() => {
    if (currentClicks > 0) {
      if (updateUserDataTimer.current) {
        clearTimeout(updateUserDataTimer.current);
      }
      updateUserDataTimer.current = setTimeout(updateUserData, 0);
    }
  }, [currentClicks, updateUserData]);

  /* Логика кликера, анимация при нажатии */
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(()=>{
      card.style.transform = '';
    },100);
    
    if (limitClicks && limitClicks <= 1) {
      toast.error('Limit! Come back in 3 hours');
      return;
    }

    setBalance((prevBalance) => (prevBalance ?? 0) + 1);
    setCurrentClicks((prevBalance) => (prevBalance ?? 0) + 1);
    setLimitClicks((prevLimitClicks) => (prevLimitClicks ?? 0) - 1);
  };

  /* Хендлеры по запросам на сервер */
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
        <div className="day-limit-text">DAY LIMIT⛅️</div>
      </div>

      <div className="counter">{balance ?? 0}</div>

      <button className="button" onClick={handleClick}>
      <Image
        src="/images/des_logo_320x320.jpg"
        alt="My Image"
        width={320}
        height={320}
      />
      </button>

      <div className="limit-display">
        {limitClicks}/{limitOfClicks}⚡️
      </div>
    </main>
  );
}
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import './clicker-page-styles.css';
import { Toaster, toast } from "sonner";

const limitOfClicks = 10000;

export default function ClickerPage() {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [balance, setBalance] = useState<number | null>(null);
  const [currentClicks, setCurrentClicks] = useState<number>(0);
  const [limitClicks, setLimitClicks] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const router = useRouter()
  
  /* При заходе в приложение получаем данные пользователя с сервера */
  useEffect(() => {
    const tg  = window.Telegram.WebApp;
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
  } else {
    router.push('/error-page')
  }
  }, [router]);

  /* Обновляем данные пользователя каждые 5 сек, если он был в них активен 
    Переменная currentClicks засчитывает каждое нажатие в нынешнем сеансе, 
    если в предыдущие 5 сек пользователь был активен, его данные обновляются в БД,
    иначе ничего не делаем
  */
  useEffect(() => {
    if (balance !== null && limitClicks !== null && userId !== undefined) {
      const updateUserData = () => {
        updateDataOnServer(userId, balance, limitClicks);
      };
      setInterval(() => {
        if(currentClicks > 0) {
          updateUserData()
          setCurrentClicks(0);
        } 
      }, 5000);
    }
  }, [balance, limitClicks, userId]);

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
    
    if (limitClicks && limitClicks <= 0) {
      toast.error('Limit!');
      return;
    }

    setBalance((prevBalance) => (prevBalance ?? 0) + 1);
    setLimitClicks((prevLimitClicks) => (prevLimitClicks ?? 0) - 1);
    setCurrentClicks((prevCurrentClicks) => (prevCurrentClicks ?? 0) + 1);
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
        <div id="day-limit-text">DAY LIMIT⛅️</div>
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

      <div id="limit-display">
        {limitClicks}/{limitOfClicks}⚡️
      </div>
    </main>
  );
}
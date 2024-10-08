'use client';
import './ref-page-styles.css';
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from "sonner";
import Referral from "@/components/referal/page"

type Referral = {
  referal_name: string;
};

export default function RefPage() {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [linkToCopy, setLinkToCopy] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* Копирование реферальной сыллки при нажатии на кнопку */
  const handleCopyLink = () => {
    if (linkToCopy) {
      navigator.clipboard.writeText(linkToCopy);
      toast.success("Link copied to clipboard!");
    }
  };

  /* Получение списка рефералов при входе в приложение */
  useEffect(() => {
    const { user } = window.Telegram.WebApp.initDataUnsafe;
    if (user && user.id) {
      
      setUserName(user.username);
      setLinkToCopy(`https://t.me/Descoin_official_bot?start=${user.id}`);

      getReferals(user.id);
      setIsLoading(false);
    } else {
      toast.error("Error on Telegram side! Try later");
      setUserName(undefined);
      setLinkToCopy('undefined');
      setIsLoading(false);
    }
  }, []);

  /* Хендлер */
  async function getReferals(userId: number) {
    try {
      // Perform request to server to get list of referrals by userId
      const response = await fetch(`https://api.descoin-web.online/getReferals/${userId}`);
      const data = await response.json();
      setReferrals(data);
    } catch (error) {
      toast.error("Error on server side! Try later");
    }
  }

  return (
    <main>
      <Toaster position="top-center" richColors />
      <div className="user-info">
        <div className="avatar">
          <div className="profile-logo-head"></div>
          <div className="profile-logo-neck"></div>
        </div>
        <p className="name-of-user">{userName || 'Unknown'}</p>
        <button className="copy-url-of-ref-btn" onClick={handleCopyLink}>COPY YOUR LINK</button>
      </div>

      <div className="list-of-referrals">      
        {isLoading ? (
          <p className="load-referrals">Loading</p>
        ) : referrals.length === 0 ? (
          <p className="load-referrals">You dont have any referrals.</p>
        ) : (
          <div className="list-of-referrals">
            {referrals.map((referral, index) => (
              <Referral
                key={index}
                index={index + 1}
                name={referral.referal_name}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

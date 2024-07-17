'use client';
import './ref-page-styles.css';
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from "sonner";
import Referal from "@/components/referal/page"

type Friend = {
  referal_name: string;
};

export default function RefPage() {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [linkToCopy, setLinkToCopy] = useState<string>('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleCopyLink = () => {
    if (linkToCopy) {
      navigator.clipboard.writeText(linkToCopy);
      toast.success("Link copied to clipboard!");
    }
  };

  useEffect(() => {
    const { user } = window.Telegram.WebApp.initDataUnsafe;
    if (user && user.id) {
      
      setUserName(user.username);
      setLinkToCopy(`https://t.me/bot_name?start=${user.id}`);

      getReferals(user.id);
      setIsLoading(false);
    } else {
      setUserName(undefined);
      setLinkToCopy('undefined');
      setIsLoading(false);
    }
  }, []);

  async function getReferals(userId: number) {
    try {
      // Perform request to server to get list of referrals by userId
      const response = await fetch(`http://localhost:9000/getReferals/${userId}`);
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      toast.error("Error on server side! Try later");
    }
  }

  return (
    <main>
      <Toaster position="top-center" richColors />
      <div className="user_info">
        <div id="avatar">
          <div id="profile_logo_head"></div>
          <div id="profile_logo_neck"></div>
        </div>
        <p id="name_of_user">{userName || 'Unknown'}</p>
        <button id="copy_url_of_ref_btn" onClick={handleCopyLink}>COPY YOUR LINK</button>
      </div>

      <div id="list_of_referals">
        {isLoading ? (
          <p className="load-friends">Loading</p>
        ) : friends.length === 0 ? (
          <p className="load-friends">You dont have any friends.</p>
        ) : (
          <div className="list-of-friends">
            {friends.map((friend, index) => (
              <Referal
                key={index}
                index={index + 1}
                name={friend.referal_name}
              />
            ))}
          </div>
        )}
      </div>

      <footer id="footer">
        <a id="footer_text" href="/" style={{ textDecoration: 'none' }}>
          🪙<br />Tap
        </a>
        <a id="footer_text" className="ref_btn" style={{ textDecoration: 'none' }}>
          👨‍💼<br />Ref
        </a>
        <a id="footer_text" href="task-page" style={{ textDecoration: 'none' }}>
          📝<br />Task
        </a>
      </footer>
    </main>
  );
}

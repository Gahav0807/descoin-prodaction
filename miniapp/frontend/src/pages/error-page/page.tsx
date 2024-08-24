'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import './error_page_styles.css';
import { Toaster, toast } from "sonner";

export default function ErrorPage() {
  return (
    <main>
      <Toaster position="top-center" richColors />
      <div className='error-notification'>
        <p id='oops'>Упс...</p>
        <p>В приложение можно войти лишь с телефона</p>
          <svg id='svg' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tablet-smartphone">
          <rect width="10" height="14" x="3" y="8" rx="2"/><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4"/>
          <path d="M8 18h.01"/>
        </svg>
      </div>
    </main>
  );
}
'use client';
import './referal-component-styles.css';


export default function Referal({index,name}) {
  return (
    <div className='referal'>
        <p>{index}. {name}</p>
    </div>
  );
}

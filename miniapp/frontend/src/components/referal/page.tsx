'use client';
import './referral-component-styles.css';

type ReferalProps = {
  index: number;
  name: string;
};

export default function Referral({ index, name }: ReferalProps) {
  return (
    <div className="referral">
      <p>{index}. {name}</p>
    </div>
  );
}

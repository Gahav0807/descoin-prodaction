'use client';
import './referal-component-styles.css';

type ReferalProps = {
  index: number;
  name: string;
};

export default function Referal({ index, name }: ReferalProps) {
  return (
    <div className="referal">
      <p>{index}. {name}</p>
    </div>
  );
}

'use client';
import './task-component-style.css';

type TaskProps = {
  task_in_db: string;
  task_name: string;
  task_price: number;
  url_of_btn: string;
  user_id: number;
};

export default function Task({
  task_in_db,
  task_name,
  task_price,
  url_of_btn,
  user_id,
}: TaskProps) {
  // Function to send a request to complete the task
  const tryDoTask = async () => {
    try {
      await fetch(`https://api.descoin-web.online/tryDoTask/${user_id}/${task_in_db}/${task_price}`);
    } catch (error) {
      console.error(error);
    }
  };

  // Call the tryDoTask function when the button is clicked
  const handleButtonClick = () => {
    tryDoTask();
  };

  return (
    <div className="task">
      <p className="task-name">{task_name}</p>
      <p className="task-price">{task_price}</p>
      <button className="claim-btn" onClick={handleButtonClick}>
        <a href={url_of_btn}>Join</a>
      </button>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

const formatTime = (time) => {
  if (!time) return 'N/A';

  let date;
  if (typeof time === 'string') {
    date = new Date(time);
    if (isNaN(date.getTime())) {
      const [hours, minutes] = time.split(':');
      date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
    }
  } else if (time instanceof Date) {
    date = time;
  } else {
    return 'Invalid Time';
  }

  if (isNaN(date.getTime())) return 'Invalid Time';

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${minutes} ${ampm}`;
};

function StatCard({ title, value, icon, color }) {
  return (
    <motion.li 
      style={{ '--accent-color': color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="icon">{icon}</div>
      <div className="title">{title}</div>
      <div className="descr">{value}</div>
    </motion.li>
  );
}

export default function StatsCards({ totalArticles, diesel, startTime }) {
  const formattedStartTime = formatTime(startTime);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Jura:wght@500;600;900&display=swap");
        
        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          --color: rgba(30, 30, 30);
          --bgColor: rgba(245, 245, 245);
          font-family: "Jura", sans-serif;
          color: var(--color);
          background: var(--bgColor);
        }
        
        .stats-container {
          margin-bottom: 2rem; /* Add bottom margin to avoid touching other components */
        }
        
        ul.stats-list {
          --col-gap: 2rem;
          --barH: 1rem;
          --roleH: 2rem;
          --flapH: 2rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          gap: var(--col-gap);
          padding: 1rem calc(var(--col-gap) / 2);
          justify-content: center;
          align-items: flex-start;
          list-style: none;
        }
        
        ul.stats-list li {
          width: 100%; /* Full width on mobile */
          max-width: 300px;
          display: grid;
          grid-template:
            "role"
            "icon"
            "title"
            "descr";
          align-items: flex-start;
          gap: 1rem;
          padding-block-end: calc(var(--flapH) + 1rem);
          text-align: center;
          background: var(--accent-color);
          background-image: linear-gradient(
            rgba(0, 0, 0, 0.6) var(--roleH),
            rgba(0, 0, 0, 0.4) calc(var(--roleH) + 0.5rem),
            rgba(0, 0, 0, 0) calc(var(--roleH) + 0.5rem + 5rem)
          );
          clip-path: polygon(
            calc(var(--col-gap) / -2 - 5px) 0,
            calc(100% + var(--col-gap) / 2 + 5px) 0,
            calc(100% + var(--col-gap) / 2 + 5px ) calc(100% - var(--flapH)),
            50% 100%,
            calc(var(--col-gap) / -2 - 5px) calc(100% - var(--flapH))
          );
          margin-bottom: 2rem; /* Add space between cards on mobile */
        }
        
        ul.stats-list li::before {
          content: "";
          grid-area: role;
          height: var(--barH);
          width: calc(100% + var(--col-gap));
          margin-left: calc(var(--col-gap) / -2);
          margin-top: calc(var(--roleH) / 2 - var(--barH) / 2);
          background: grey;
          z-index: -1;
          background-image: linear-gradient(
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.2) 30%,
            rgba(255, 255, 255, 0.1) 40%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.2) 70%,
            rgba(0, 0, 0, 0.4)
          );
        }
        
        ul.stats-list li::after {
          content: "";
          grid-area: role;
          background: var(--accent-color);
          background-image: linear-gradient(
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.2) 30%,
            rgba(255, 255, 255, 0.1) 40%,
            rgba(0, 0, 0, 0.1) 60%,
            rgba(0, 0, 0, 0.2) 70%,
            rgba(0, 0, 0, 0.4)
          );
          height: var(--roleH);
        }
        
        ul.stats-list li .icon,
        ul.stats-list li .title,
        ul.stats-list li .descr {
          padding-inline: 1rem;
          color: white;
          text-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
        }
        
        ul.stats-list li .icon {
          font-size: 3rem;
        }
        
        ul.stats-list li .title {
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        ul.stats-list li .descr {
          font-size: 2rem; /* Make numbers more eye-catching */
          font-weight: 900; /* Make numbers bolder */
        }
        
        /* Responsive adjustments */
        @media (min-width: 768px) {
          ul.stats-list li {
            width: calc(50% - var(--col-gap)); /* Two cards per row on tablets */
          }
        }
        
        @media (min-width: 1024px) {
          ul.stats-list li {
            width: calc(33.333% - var(--col-gap)); /* Three cards per row on desktop */
          }
        }
      `}</style>
      <div className="stats-container">
        <ul className="stats-list">
          <StatCard title="Total Boxes" value={totalArticles} icon="📦" color="#0B374D" />
          <StatCard title="Diesel Expense" value={diesel} icon="⛽" color="#1286A8" />
          <StatCard title="Vehicle Start Time" value={formattedStartTime} icon="🕒" color="#D2B53B" />
        </ul>
      </div>
    </>
  );
}
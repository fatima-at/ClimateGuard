import React from 'react';
import styled from 'styled-components';

const Card = ({ temperature, minTemp, maxTemp, date }) => {
  return (
    <StyledWrapper>
      <div className="card bg-white dark:bg-slate-700 shadow-md rounded-2xl p-6 relative h-full w-full transition-all duration-500">
        <div className="container">
          <div className="cloud front">
            <span className="left-front" />
            <span className="right-front" />
          </div>
          <span className="sun sunshine" />
          <span className="sun" />
          <div className="cloud back">
            <span className="left-back" />
            <span className="right-back" />
          </div>
        </div>

        <div className="card-header">
          <span className="location text-gray-800 dark:text-white font-medium text-sm">
            AlHadath<br />Lebanon
          </span>
          <span className="date text-gray-500 dark:text-gray-300 text-sm font-medium">
            {date}
          </span>
        </div>

        <span className="temp text-gray-900 dark:text-white">{temperature}°</span>

        <div className="min-max">
          <span className="min text-gray-600 dark:text-gray-400">Min: {minTemp}°</span>
          <span className="max text-gray-600 dark:text-gray-400">Max: {maxTemp}°</span>
        </div>

        <div className="temp-scale bg-gray-200 dark:bg-slate-600">
          <span className="text-gray-700 dark:text-gray-200">Celsius</span>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
    border-radius: 23px;
    transition: all 0.5s cubic-bezier(0.15, 0.83, 0.66, 1);
    cursor: pointer;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .container {
    width: 250px;
    height: 250px;
    position: absolute;
    right: -35px;
    top: -50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.7);
  }

  .cloud {
    width: 250px;
  }

  .front {
    padding-top: 45px;
    margin-left: 25px;
    display: inline;
    position: absolute;
    z-index: 11;
    animation: clouds 8s infinite ease-in-out;
  }

  .back {
    margin-top: -30px;
    margin-left: 150px;
    z-index: 12;
    animation: clouds 12s infinite ease-in-out;
  }

  .right-front {
    width: 45px;
    height: 45px;
    border-radius: 50% 50% 50% 0%;
    background-color: #4c9beb;
    display: inline-block;
    margin-left: -25px;
    z-index: 5;
  }

  .left-front {
    width: 65px;
    height: 65px;
    border-radius: 50% 50% 0% 50%;
    background-color: #4c9beb;
    display: inline-block;
    z-index: 5;
  }

  .right-back {
    width: 50px;
    height: 50px;
    border-radius: 50% 50% 50% 0%;
    background-color: #4c9beb;
    display: inline-block;
    margin-left: -20px;
    z-index: 5;
  }

  .left-back {
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 0% 50%;
    background-color: #4c9beb;
    display: inline-block;
    z-index: 5;
  }

  .sun {
    width: 120px;
    height: 120px;
    background: linear-gradient(to right, #fcbb04, #fffc00);
    border-radius: 60px;
    display: inline;
    position: absolute;
  }

  .sunshine {
    animation: sunshines 2s infinite;
  }

  @keyframes sunshines {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }

  @keyframes clouds {
    0% {
      transform: translateX(15px);
    }
    50% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(15px);
    }
  }

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .temp {
    position: absolute;
    left: 25px;
    bottom: 12px;
    font-weight: 700;
    font-size: 3.75rem; /* 60px */
    line-height: 77px;
  }

  .temp-scale {
    width: 80px;
    height: 36px;
    position: absolute;
    right: 25px;
    bottom: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
  }

  .temp-scale span {
    font-weight: 700;
    font-size: 13px;
    line-height: 1.3;
  }

  .min-max {
    position: absolute;
    left: 130px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .min, .max {
    font-weight: 600;
    font-size: 0.875rem; /* 14px */
  }
`;

export default Card;

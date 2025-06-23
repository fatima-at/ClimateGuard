import styled from 'styled-components';

export default function Widget({
  label,
  value,
  predictedValue,
  icon,
  description,
  date,
  trend,
  max,
  min,
}) {
  // Helper to render min/max consistently and elegantly
  const renderMinMax = () => {
    if (min !== undefined && max !== undefined) {
      return (
        <div className="min-max" style={{ position: 'absolute', bottom: 20, left: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="min" style={{ fontWeight: 600, fontSize: '0.875rem', color: 'inherit' }}>
            Min: {min}{label === 'Temperature' ? '°' : label === 'Relative Humidity' ? '%' : label === 'Wind Speed' ? ' km/h' : ''}
          </span>
          <span className="max" style={{ fontWeight: 600, fontSize: '0.875rem', color: 'inherit' }}>
            Max: {max}{label === 'Temperature' ? '°' : label === 'Relative Humidity' ? '%' : label === 'Wind Speed' ? ' km/h' : ''}
          </span>
        </div>
      );
    }
    return null;
  };

  // Temperature widget with clouds and sun animation (complex)
if (label === 'Temperature') {
    return (
      <StyledWrapper>
        <div className="card bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText relative h-full w-full p-6 cursor-pointer transition-all duration-500">
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
              AlHadath
              <br />
              Lebanon
            </span>
            <span className="date text-gray-500 dark:text-gray-300 text-sm font-medium">
              {date instanceof Date
                ? date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
                : date}
            </span>
          </div>

          <span className="temp text-gray-900 dark:text-white">{value}°</span>

          {/* Predicted temperature below today's temp */}
          {predictedValue !== undefined && (
            <span
              className="predicted-temp text-gray-600 dark:text-gray-400 block mt-1"
              style={{ fontSize: '1rem', fontWeight: '600' }}
              title="Tomorrow's predicted temperature"
            >
              Tomorrow: ≈ {predictedValue}°
            </span>
          )}

          {/* Min/max already here */}
          <div className="min-max">
            <span className="min text-gray-600 dark:text-gray-400">Min: {min}°</span>
            <span className="max text-gray-600 dark:text-gray-400">Max: {max}°</span>
          </div>

          <div className="temp-scale bg-gray-200 dark:bg-slate-600 rounded-md">
            <span className="text-gray-700 dark:text-gray-200">Celsius</span>
          </div>
        </div>
      </StyledWrapper>
    );
  }

  // Solar Radiation Radial Meter
if (label === 'Solar Radiation') {
  const percentage = max ? Math.round((value / max) * 100) : 0;
  return (
    <StyledWrapper>
      <div className="card bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText shadow-md rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-transform duration-300 rounded-2xl relative">
        <div className="relative w-28 h-28 mb-4">
          <div
            className="absolute inset-0 rounded-full border-[10px] border-blue-400 dark:border-darkcontrast"
            style={{
              borderTopColor: 'transparent',
              transform: `rotate(${(percentage / 100) * 360}deg)`,
              transition: 'transform 1s ease',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {percentage}%
          </div>
        </div>
        <div className="text-gray-800 dark:text-white font-medium">Solar Radiation</div>
        <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">{value} W/m²</div>

        {/* Min/max side by side */}
        <div className="flex justify-between w-full text-xs text-gray-600 dark:text-gray-300 px-6">
          <span>{min} W/m²</span>
          <span>{max} W/m²</span>
        </div>
      </div>
    </StyledWrapper>
  );
}


  // Wind Speed Dial / Animated Bar
if (label === 'Wind Speed') {
  // Clamp value between min and max to prevent needle overflow
  const clampedValue = Math.min(Math.max(value, min), max);
  const range = max - min || 1; // avoid division by zero
  // Map 0-180 degrees to -90 to +90 degrees to flip needle "up"
  const angle = ((clampedValue - min) / range) * 180 - 90;

  return (
    <StyledWrapper>
      <div className="card bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText shadow-md rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition-transform duration-300 relative">
        <div className="relative w-32 h-16 mb-3">
          <div className="absolute inset-0 w-full h-full rounded-t-full border-4 border-blue-500 dark:border-darkcontrast" />
          <div
            className="absolute bottom-0 left-1/2 w-1 h-16 bg-red-500 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${angle}deg)`,
              transformOrigin: 'bottom center',
              transition: 'transform 0.5s ease',
            }}
          />
        </div>

        {/* Min/Max labels positioned left and right */}
        <div className="flex justify-between w-full text-xs text-gray-600 dark:text-gray-300 px-1 mb-2">
          <span>{min} km/h</span>
          <span>{max} km/h</span>
        </div>

        <div className="text-gray-800 dark:text-white font-medium">{label}</div>
        <div className="text-xl font-bold text-gray-800 dark:text-white">{value} km/h</div>
      </div>
    </StyledWrapper>
  );
}

  // Wind Direction Compass
  if (label === 'Wind Direction') {
    const directions = {
      N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315,
    };
    const angle = directions[value] ?? 0;
    return (
      <StyledWrapper>
        <div className="card bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText shadow-md rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition-transform duration-300 relative">
          <div className="relative w-28 h-28 mb-1"> {/* increased from w-20 h-20 */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-400 dark:border-gray-300" />
          <div
            className="absolute top-1/2 left-1/2 w-1 h-14 bg-red-500 dark:bg-darkcontrast origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
          />
        </div>

          <div className="text-gray-800 dark:text-white font-medium">{label}</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">{value}</div>

        <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-300 mt-2 w-full">
          <span>Min: {min}</span>
          <span>Max: {max}</span>
        </div>
        </div>
      </StyledWrapper>
    );
  }

  // Dew Point & Pressure widget
if (['Dew Point', 'Pressure'].includes(label)) {
  return (
    <StyledWrapper>
      <div className="card bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText shadow-md rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition-transform duration-300 relative">
        <div className="text-6xl mb-3">{icon}</div>
        <div className="text-md font-medium text-gray-800 dark:text-white mb-1">{label}</div>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
        {(description || trend) && (
          <div className="text-sm text-gray-500 dark:text-gray-300">{description || trend}</div>
        )}

        {/* Min/max centered below */}
        <div className="flex justify-center gap-4 text-xs text-gray-600 dark:text-gray-300 mt-2 w-full">
          <span>Min: {min}</span>
          <span>Max: {max}</span>
        </div>
      </div>
    </StyledWrapper>
  );
}


  // Relative Humidity widget with progress bar
if (label === 'Relative Humidity') {
  const percent = max ? Math.min((value / max) * 100, 100) : 0;
  return (
    <StyledWrapper>
      <div className="card bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText shadow-md rounded-2xl p-6 flex flex-col cursor-pointer hover:shadow-lg transition-transform duration-300 relative">
        <div className="text-6xl mb-3">{icon}</div>
        <div className="text-md font-medium text-gray-800 dark:text-white mb-1">{label}</div>
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{value}%</div>

        <div className="relative w-full h-3 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500 dark:bg-darkcontrast transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-300 text-center">{description}</div>
        )}
      
      {}
      <div className="text-gray-600 dark:text-gray-300">
      <span
            className="text-sm text-gray-500 dark:text-gray-300"
            style={{
              position: 'absolute',
              left: 30,
              top: '80%',
              fontSize: '0.75rem'
            }}
          >
            {min}%
          </span>
          {}
          <span
            className="text-sm text-gray-500 dark:text-gray-300"
            style={{
              position: 'absolute',
              right: 30,
              top: '80%',
              fontSize: '0.75rem'
            }}
          >
            {max}%
          </span>
          </div>
          </div>
    </StyledWrapper>
  );
}


  // Default fallback
  return (
    <StyledWrapper>
      <div className="card bg-lightBg text-lightText dark:darkmain dark:text-darkText shadow-md rounded-2xl p-5 w-full cursor-pointer hover:shadow-lg transition-transform duration-300 relative">
        <div className="text-sm text-gray-500 dark:text-gray-300">{label}</div>
        <div className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2 mt-2">
          <span className="text-3xl">{icon}</span>
          <span>{value}</span>
        </div>

        {renderMinMax()}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    height: 100%;
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
    left: 190px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .min,
  .max {
    font-weight: 600;
    font-size: 0.875rem; 
  }
`;

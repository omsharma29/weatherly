import type { WeatherComps } from "../page/Homepage";

type WeatherProps = {
  weather: WeatherComps[] | undefined;
};

function HourWiseTemp({ weather }: WeatherProps) {
  if (!weather || weather.length === 0) {
    return (
      <div className="w-full p-4 rounded-xl shadow-md text-center text-gray-500">
        Loading hourly forecast...
      </div>
    );
  }

  const now = new Date();

  // Filter only future times
const futureHours = weather.filter(hour => new Date(hour.dt_txt) >= now);

  // Find the nearest hour to current time
//   const nearestHour = futureHours.reduce((prev, curr) =>
//     Math.abs(curr.dt * 1000 - now) < Math.abs(prev.dt * 1000 - now)
//       ? curr
//       : prev
//   );

  return (
    <div className="w-full p-4 rounded-xl shadow-md overflow-x-auto no-scrollbar">
      <div className="flex gap-5 min-w-max">
        {futureHours.map((hour, index) => (
          <div
            key={index}
            className={`flex flex-col items-center rounded-lg p-5 min-w-[110px] shadow transition-transform`}
          >
            <span className="text-base font-medium text-gray-600">
              {new Date(hour.dt_txt).toLocaleTimeString([], {
                hour: "numeric",
                hour12: true,
              })}
            </span>

            <img
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
              alt={hour.weather[0].description}
              className="w-12 h-12"
            />
            <span className="text-lg font-bold text-gray-800">
              {Math.round(hour.main.temp - 273.15)}°C
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourWiseTemp;

import type { WeatherComps } from "../page/Homepage";

type WeatherProps = {
    weather: WeatherComps[] | undefined;
};

function HourWiseTemp({ weather }: WeatherProps) {
    if (!weather || weather.length === 0) {
        return (
            <div className="w-full p-4 rounded-xl shadow-md text-center text-gray-500">
                Loading daily forecast...
            </div>
        );
    }

    // Group by date and take first entry of each day
    const dailyWeather = Object.values(
        weather.reduce((acc: { [key: string]: WeatherComps }, item) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = item; // ✅ store the actual weather object
            }
            return acc;
        }, {})
    );

    return (
        <div className="w-full p-4 rounded-xl shadow-md h-[260px] overflow-y-auto md:h-auto md:overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-2 gap-5 md:flex md:gap-5 md:min-w-max">
                {dailyWeather.map((day, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center  rounded-lg p-5 min-w-[110px] shadow hover:scale-105 transition-transform"
                    >
                        {/* Show the date */}
                        <span className="text-base font-medium text-gray-600">
                            {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>

                        {/* Weather icon */}
                        <img
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt={day.weather[0].description}
                            className="w-12 h-12"
                        />

                        {/* Temperature in Celsius */}
                        <span className="text-lg font-bold text-gray-800">
                            {Math.round(day.main.temp - 273.15)}°C
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HourWiseTemp;

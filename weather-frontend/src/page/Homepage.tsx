import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { FetchData, FetchLatLong } from "../functions/FetchTemp";
import axios from "axios";
import HourWiseTemp from "../pageComps/HourWiseTemp";
import DayWiseTemp from "../pageComps/DayWiseTemp";
import Rainy from "../weatherVideo/Rainy.mp4";
import Sunny from "../weatherVideo/Sunny.mp4";
import Cloudy from "../weatherVideo/Cloudy.mp4";
import { Oval } from 'react-loader-spinner';
import { useDebounce } from "../functions/Debounce";



export type WeatherComps = {
  dt: number;
  dt_txt: number
  main: { temp: number, feels_like: number, temp_max: number, temp_min: number, humidity: number, pressure: number };
  rain?: {
    "3h": number; // property name is "3h" so must be in quotes
  };
  visibility: number;
  weather: { icon: string; description: string; main: string }[];
};

export type WeatherApiResponse = {
  city: {
    coord: { lat: number; lon: number };
    country: string;
    id: number;
    name: string;
    population: number;
    sunrise: number;
    sunset: number;
    timezone: number;
  };
  cnt: number;
  cod: string;
  list: WeatherComps[];
};





const weatherVideos: Record<string, string> = {
  Rainy: Rainy,
  Mist: Cloudy,
  Sunny: Sunny,
};

export default function Homepage() {

  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherApiResponse>()
  const [loading, setloading] = useState<Boolean>(false)
  const [city, setCity] = useState<string>("")

  const weatherBg = () => {
    if (!weather) return null;
    const mainWeather = nearestHour?.weather[0].main
    if (mainWeather == "Rain") return weatherVideos.Rainy;
    if (mainWeather === "Mist") return weatherVideos.Mist;
    if (mainWeather === "Clouds") return weatherVideos.Sunny;
    return null;
  }

  useEffect(() => {
    const LoadWeather = async () => {
      try {
        setError(null)
        setloading(true)
        const SavedLat = localStorage.getItem("latitude")
        const SavedLong = localStorage.getItem("longitude")
        if (SavedLat && SavedLong) {
          const fetchData = await FetchData({
            latitude: SavedLat,
            longitude: SavedLong,
          })
          setWeather(fetchData)
          setloading(false)
          console.log(fetchData)
        } else {
          navigator.geolocation.getCurrentPosition(async (position) => {
            setloading(true)
            const Latitude = position.coords.latitude.toString()
            const Longitude = position.coords.longitude.toString()
            localStorage.setItem("latitude", Latitude)
            localStorage.setItem("longitude", Longitude)
            const fetchData = await FetchData({
              latitude: Latitude,
              longitude: Longitude
            })
            setWeather(fetchData)
            setloading(false)
            console.log(fetchData)
          })
        }
      } catch (err: any) {
        console.error(err)
        if (axios.isAxiosError(err)) {
          if (err.response) {
            // 👇 show backend’s actual error message
            setError(`Error ${err.response.status}: ${err.response.data}`);
          } else if (err.request) {
            setError("No response from server.");
          } else {
            setError(err.message);
          }
        } else {
          setError("Unexpected error");
        }

      }

    }

    LoadWeather()
  }
    , [])

  const debouncedCity = useDebounce(city, 5000); // 500ms after user stops typing

  useEffect(() => {
    if (!debouncedCity) return;

    const fetchWeather = async () => {
      try {
        setloading(true);

        const data = await FetchLatLong(debouncedCity);

        const coords = {
          latitude: data.coord.lat.toString(),
          longitude: data.coord.lon.toString(),
        };

        const setData = await FetchData(coords);
        setWeather(setData);
        setloading(false);
      } catch (error) {
        console.error("Error fetching lat/long:", error);
        setloading(false);
      }
    };

    fetchWeather();
  }, [debouncedCity]);



  if (error) return <div className="h-screen bg-black flex justify-center items-center">
    <p className="text-red-500 font-semibold">{error}</p>
  </div>

  const now = new Date();

  // Filter only future times
  const futureHours = weather?.list.filter(hour => new Date(hour.dt_txt) >= now)

  const nearestHour = futureHours?.reduce((prev: WeatherComps, curr: WeatherComps) => {
    const prevDiff = Math.abs(new Date(prev.dt_txt).getTime() - now.getTime())
    const currDiff = Math.abs(new Date(curr.dt_txt).getTime() - now.getTime())
    return currDiff < prevDiff ? curr : prev;
  })


  return (
    <>

      <div className="relative w-full h-screen ">
        {weather && (
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
            src={weatherBg()!}
          />
        )}
        <div className="flex z-10 md:flex-row flex-col-reverse max-w-full  gap-1 p-3 overflow-x-hidden box-border">

          <div className="text-black flex md:w-[60%] w-full max-w-full  ">
            <Card className="left w-full md:h-full  bg-black/40 backdrop-blur-md text-white p-6 rounded-xl box-border">
              <CardHeader>
                <CardTitle className="text-2xl font-extrabold">Weatherly - forecast</CardTitle>
              </CardHeader>
              {/* Input Section */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-1 rounded-xl border focus:outline-none focus:ring-2 shadow-sm text-gray-700"
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center w-full h-full">
                  <Oval
                    height={40}       // bigger for visibility
                    width={40}
                    color="#ffffff"
                    secondaryColor="#ccc"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                    visible={true}
                    ariaLabel="loading"
                  />
                </div>
              ) : (<CardContent className="flex flex-col md:justify-center gap-10  w-full ">


                {/* Hourly Temperature */}
                <div className=" w-full ">
                  <h2>Temperature Hours</h2>
                  <HourWiseTemp weather={weather?.list} />

                </div>

                {/* 5 Days Temperature */}
                <div className=" ">
                  <h2>Temprature day wise</h2>
                  <div className="5daysTemp">
                    <DayWiseTemp weather={weather?.list} />
                  </div>
                </div>

              </CardContent>)
              }


            </Card>
          </div>

          <div className="text-black flex md:w-[40%] w-full max-w-full ">
            <Card className="right w-full bg-black/40 backdrop-blur-md text-white p-6 rounded-xl box-border">

              {loading ?
                <div className="flex justify-center items-center w-full h-full">
                  <Oval
                    height={40}       // bigger for visibility
                    width={40}
                    color="#ffffff"
                    secondaryColor="#ccc"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                    visible={true}
                    ariaLabel="loading"
                  />
                </div> : <>
                  <CardHeader>
                    <CardTitle className="font-bold text-2xl">{weather?.city.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-10">

                    {/* Top Half */}
                    <div className="currentTemp  flex md:justify-around text-white  gap-8">
                      <div>
                        <h2 className="text-5xl font-extrabold hover:scale-105 transition-transform">
                          {nearestHour?.main.temp !== undefined
                            ? (nearestHour?.main.temp - 273.15).toFixed(1) + "°C"
                            : "Loading..."}
                        </h2>
                        <img
                          src={`https://openweathermap.org/img/wn/${nearestHour?.weather[0].icon}@2x.png`}
                          alt={nearestHour?.weather[0].icon}
                          className="w-20 h-20 hover:scale-120 transition-transform"
                        />
                        <span className="text-base font-medium text-gray-600">
                          {weather?.list?.[0]?.dt_txt !== undefined ?
                            new Date().toLocaleTimeString([], {
                              weekday: "short",  // e.g. "Wed"
                              year: "numeric",
                              month: "short",    // e.g. "Aug"
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true
                            }) :
                            "loading..."
                          }
                        </span>
                      </div>
                      <div className="flex flex-col justify-evenly">
                        <h2 className="font-bold text-gray-600"> Feels Like:
                          <span className="text-white">
                            {nearestHour?.main.feels_like !== undefined
                              ? " " + (nearestHour?.main.feels_like - 273.15).toFixed(1) + "°C"
                              : "Loading..."}
                          </span>

                        </h2>
                        <h2 className="font-bold text-gray-600"> Max Temp:
                          <span className="text-white">
                            {nearestHour?.main.temp_max !== undefined
                              ? " " + (nearestHour?.main.temp_max - 273.15).toFixed(1) + "°C"
                              : "Loading..."}
                          </span>

                        </h2>
                        <h2 className="font-bold text-gray-600"> Min Temp:
                          <span className="text-white">
                            {nearestHour?.main.temp_min !== undefined
                              ? " " + (nearestHour?.main.temp_min - 273.15).toFixed(1) + "°C"
                              : "Loading..."}
                          </span>

                        </h2>
                      </div>
                    </div>

                    {/* Bottom Half */}
                    <div className="4cards grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 md:grid-rows-2 gap-3
                 ">
                      <div className="cards flex flex-col items-center gap-2 md:gap-4 text-white rounded-lg border border-white/50 hover:scale-105 transition-transform p-3 w-full min-h-[120px] md:min-h-[160px]">
                        <h2 className="text-sm md:text-xl text-gray-700 font-bold pt-1 md:pt-2">Humidity</h2>
                        <span className="text-lg md:text-2xl font-extrabold">{nearestHour?.main.humidity !== undefined ? (nearestHour?.main.humidity + " %") : "Loading"}</span>
                      </div>
                      <div className="cards flex flex-col items-center gap-2 md:gap-4 text-white rounded-lg border border-white/50 hover:scale-105 transition-transform p-3 w-full min-h-[120px] md:min-h-[160px]">
                        <h2 className="text-sm md:text-xl text-gray-700 font-bold pt-1 md:pt-2">Pressure</h2>
                        <span className="text-lg md:text-2xl font-extrabold">{nearestHour?.main.pressure !== undefined ? (nearestHour?.main.pressure + " hPa") : "Loading"}</span>
                      </div>
                      <div className="cards flex flex-col items-center gap-2 md:gap-4 text-white rounded-lg border border-white/50 hover:scale-105 transition-transform p-3 w-full min-h-[120px] md:min-h-[160px]">
                        <h2 className="text-sm md:text-xl text-gray-700 font-bold pt-1 md:pt-2">Rainfall</h2>
                        <span className="text-lg md:text-2xl font-extrabold">{nearestHour?.rain?.["3h"] !== undefined ? (nearestHour?.rain["3h"] + " mm") : "No"} </span>
                      </div>
                      <div className="cards flex flex-col items-center gap-2 md:gap-4 text-white rounded-lg border border-white/50 hover:scale-105 transition-transform p-3 w-full min-h-[120px] md:min-h-[160px]">
                        <h2 className="text-sm md:text-xl text-gray-700 font-bold pt-1 md:pt-2">Visibility</h2>
                        <span className="text-lg md:text-2xl font-extrabold">{nearestHour?.visibility !== undefined ? ((nearestHour?.visibility) / 1000 + " km") : "Loading"}</span>
                      </div>
                    </div>



                  </CardContent>
                </>
              }



            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

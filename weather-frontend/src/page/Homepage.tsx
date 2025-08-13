import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { FetchData } from "../functions/FetchTemp";
import axios from "axios";
import HourWiseTemp from "../pageComps/HourWiseTemp";
import DayWiseTemp from "../pageComps/DayWiseTemp";

export type WeatherComps = {
  dt: number;
  dt_txt: number
  main: { temp: number, feels_like: number, temp_max: number, temp_min: number, humidity:number, pressure:number};
  rain?: {
    "3h": number; // property name is "3h" so must be in quotes
  };
  visibility: number;
  weather: { icon: string; description: string }[];
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



export default function Homepage() {

  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherApiResponse>()

  useEffect(() => {
    const LoadWeather = async () => {
      try {
        setError(null)
        const SavedLat = localStorage.getItem("latitude")
        const SavedLong = localStorage.getItem("longitude")
        if (SavedLat && SavedLong) {
          const fetchData = await FetchData({
            latitude: SavedLat,
            longitude: SavedLong,
          })
          setWeather(fetchData)
          console.log(fetchData)
        } else {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const Latitude = position.coords.latitude.toString()
            const Longitude = position.coords.longitude.toString()
            localStorage.setItem("latitude", Latitude)
            localStorage.setItem("longitude", Longitude)
            const fetchData = await FetchData({
              latitude: Latitude,
              longitude: Longitude
            })
            setWeather(fetchData)
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

  if (error) return <div className="h-screen flex justify-center items-center">
    <p className="text-red-500 font-semibold">{error}</p>
  </div>



  return (
    <>


      <div className="flex md:flex-row flex-col-reverse max-w-full  gap-1 p-3">

        <div className="text-black flex md:w-[60%] w-full h-screen ">
          <Card className="left w-full md:h-full  bg-black/40 backdrop-blur-md text-white p-6 rounded-xl">
            <CardHeader>
              <CardTitle>Forecast</CardTitle>
            </CardHeader>
            {/* Input Section */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter city name..."
                className="w-full px-4 py-1 rounded-xl border focus:outline-none focus:ring-2 shadow-sm text-gray-700"
              />
            </div>
            <CardContent className="flex flex-col md:justify-center gap-10  h-[600px] w-full ">


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

            </CardContent>

          </Card>
        </div>

        <div className="text-black flex md:w-[40%] w-full ">
          <Card className="right w-full bg-black/40 backdrop-blur-md text-white p-6 rounded-xl">
            <CardHeader>
              <CardTitle className="font-bold text-2xl">{weather?.city.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-10">
           
                {/* Top Half */}
                <div className="currentTemp  flex md:justify-around text-white  gap-8">
                  <div>
                    <h2 className="text-5xl font-extrabold hover:scale-105 transition-transform">
                      {weather?.list?.[0]?.main?.temp !== undefined
                        ? (weather.list[0].main.temp - 273.15).toFixed(1) + "°C"
                        : "Loading..."}
                    </h2>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather?.list[0].weather[0].icon}@2x.png`}
                      alt={weather?.list[0].weather[0].icon}
                      className="w-20 h-20 hover:scale-120 transition-transform"
                    />
                    <span className="text-base font-medium text-gray-600">
                      {weather?.list?.[0]?.dt_txt !== undefined ?
                        new Date(weather?.list[0].dt_txt).toLocaleTimeString([], {
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
                        {weather?.list?.[0]?.main?.temp !== undefined
                        ? " "+ (weather.list[0].main.feels_like - 273.15).toFixed(1) + "°C"
                        : "Loading..."}
                      </span>
                      
                    </h2>
                    <h2 className="font-bold text-gray-600"> Max Temp: 
                      <span className="text-white">
                         {weather?.list?.[0]?.main?.temp !== undefined
                        ? " "+ (weather.list[0].main.temp_max - 273.15).toFixed(1) + "°C"
                        : "Loading..."}
                      </span>
                     
                    </h2>
                    <h2 className="font-bold text-gray-600"> Min Temp: 
                      <span className="text-white">
                        {weather?.list?.[0]?.main?.temp !== undefined
                        ? " "+ (weather.list[0].main.temp_min - 273.15).toFixed(1) + "°C"
                        : "Loading..."}
                      </span>
                      
                    </h2>
                  </div>
                </div>

                {/* Bottom Half */}
                <div className="4cards hidden md:grid flex-2 w-full gap-4 
                  md:grid-cols-2 md:grid-rows-2 sm:grid-cols-1 sm:grid-rows-4
                 ">
                  <div className="cards flex flex-col items-center gap-10  text-white rounded-lg border h-40 border-white/50 hover:scale-105 transitiontransform">
                    <h2 className="text-2xl text-gray-700 font-bold pt-3">Humidity</h2>
                    <span className="text-3xl font-extrabold">{weather?.list?.[0]?.main?.humidity !== undefined ? (weather.list[0].main.humidity + " %") : "Loading"}</span>
                  </div>
                  <div className="cards flex flex-col items-center gap-10 text-white rounded-lg border border-white/50 hover:scale-105 transitiontransform">
                    <h2 className="text-2xl text-gray-700 font-bold pt-3">Pressure</h2>
                    <span className="text-3xl font-extrabold">{weather?.list?.[0]?.main?.pressure !== undefined ? (weather.list[0].main.pressure + " hPa") : "Loading"}</span>
                  </div>
                  <div className="cards flex flex-col items-center gap-10 text-white rounded-lg border border-white/50 hover:scale-105 transitiontransform">
                    <h2 className="text-2xl text-gray-700 font-bold pt-3">Rainfall</h2>
                    <span className="text-3xl font-extrabold">{weather?.list?.[0]?.rain?.["3h"] !== undefined ? (weather.list[0].rain["3h"] + " mm") : "Loading"} </span>
                  </div>
                  <div className="cards flex flex-col items-center gap-10 text-white rounded-lg border border-white/50 hover:scale-105 transitiontransform">
                     <h2 className="text-2xl text-gray-700 font-bold pt-3">Visibility</h2>
                     <span className="text-3xl font-extrabold">{weather?.list?.[0]?.visibility !== undefined ? ((weather.list[0].visibility)/1000 + " km") : "Loading"}</span>
                  </div>
                </div>
             


            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

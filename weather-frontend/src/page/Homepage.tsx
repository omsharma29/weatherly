import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { FetchData } from "../functions/FetchTemp";
import axios from "axios";


type WeatherProps = {
  setWeather: React.Dispatch<React.SetStateAction<never[]>>
}

export default function Homepage() {

  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherProps>()

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
      <div className="flex md:flex-row flex-col-reverse max-w-full h-screen gap-1 p-3">

        <div className="text-black flex md:w-[60%] w-full h-full">
          <Card className="left w-full md:h-full bg-black/40 backdrop-blur-md text-white p-6 rounded-xl">
            <CardHeader>
              <CardTitle>Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="input"></div>
              <div className="HourWiseTemp">
               { /**
                * 1st 4 days
                */}
              </div>
              <div>
                <h2>Next 5 days Temperature</h2>
                <div className="5daysTemp">
                  {/**
                   * rest 5 days
                   */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-black flex md:w-[40%] w-full">
          <Card className="right w-full bg-black/40 backdrop-blur-md text-white p-6 rounded-xl">
            <CardHeader>
              <CardTitle>Temperatur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-10">
                {/* Top Half */}
                <div className="currentTemp flex-1 flex items-center justify-center text-white">
                  Current Temp Section
                </div>

                {/* Bottom Half */}
                <div className="4cards hidden md:grid flex-2 w-full gap-4 
                  md:grid-cols-2 md:grid-rows-2 sm:grid-cols-1 sm:grid-rows-4
                 ">
                  <div className="cards flex items-center justify-center text-white rounded-lg border h-40 border-white/50">
                    card1
                  </div>
                  <div className="cards flex items-center justify-center text-white rounded-lg border border-white/50">
                    card2
                  </div>
                  <div className="cards flex items-center justify-center text-white rounded-lg border border-white/50">
                    card3
                  </div>
                  <div className="cards flex items-center justify-center text-white rounded-lg border border-white/50">
                    card4
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

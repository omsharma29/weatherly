import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Homepage() {
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
              <div className="HourWiseTemp"></div>
              <div>
                <h2>Next 5 days Temperature</h2>
                <div className="5daysTemp"></div>
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

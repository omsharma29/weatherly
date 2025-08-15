import axios from "axios"

export const WeatherForecast = async (c: any) => {
    // return c.text('Weather forecast endpoint is not implemented yet', 501)
  const latitude = c.req.query("latitude")
  const longitude = c.req.query("longitude")
  console.log("Latitude:", latitude, "Longitude:", longitude)

  if (!latitude || !longitude) {
    return c.text("Latitude and Longitude query parameters are required", 400)
  }

  try {
    const response = await axios.get(
      c.env.WEATHER_FORECAST_URL as string,
      {
        params: {
          latitude : latitude,
          longitude : longitude,
          lang: "EN",
        },
        headers: {
          "x-rapidapi-key": c.env.RAPIDAPI_KEY as string,
          "x-rapidapi-host": c.env.RAPIDAPI_HOST as string,
        },
      }
    )

    return c.json(response.data, 200)
  } catch (error: any) {
    console.error("Error fetching weather forecast data:", error.message)
    return c.json(
      {
        error: "Failed to fetch weather forecast data",
      },
      500
    )
  }
}

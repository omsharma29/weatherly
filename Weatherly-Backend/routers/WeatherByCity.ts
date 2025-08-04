import axios from "axios"



export const WeatherByCity = async (c : any) => {
  try {
    const city = c.req.query('city') 
    if(!city){
        return c.text('City query parameter is required', 400)
    }

    const fetch = await axios.get(process.env.WEATHER_URL as string, {
      params: {
        city,
        lang: 'EN',
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY as string,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST as string,
      }
    })
    return c.json(fetch.data, 200)
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return c.json({
      error: 'Failed to fetch weather data',
    }, 500)
  }
}
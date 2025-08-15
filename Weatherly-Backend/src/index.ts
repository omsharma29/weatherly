import { Hono } from 'hono'
import { WeatherByCity } from './routers/WeatherByCity'
import { WeatherForecast } from './routers/WeatherForCast'
import { withCache } from './cache/cache'
import { cors } from 'hono/cors'

const app = new Hono()

// Simple in-memory rate limiter (Worker-compatible)
const requests = new Map<string, { count: number; last: number }>()
const WINDOW_MS = 24 * 60 * 60 * 1000
const LIMIT = 5

const rateLimiter = async (c: any, next: () => Promise<any>) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown'
  const now = Date.now()

  const record = requests.get(ip)

  if (!record) {
    requests.set(ip, { count: 1, last: now })
  } else {
    if (now - record.last > WINDOW_MS) {
      // reset count after window
      record.count = 1
      record.last = now
    } else {
      record.count++
      if (record.count > LIMIT) {
        return c.text('Rate limit exceeded', 429)
      }
    }
    requests.set(ip, record)
  }

  await next()
}

// Apply middleware
app.use('/*', cors())
app.use('/*', rateLimiter)

app.get('/', withCache(async (c) => {
  await new Promise(resolve => setTimeout(resolve, 5000))
  return c.json({ message: "Hello, world!" })
}))

app.get('/weather', withCache(WeatherByCity))
app.get('/forecast', withCache(WeatherForecast))

export default app

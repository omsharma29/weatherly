import 'dotenv/config';
import { serve } from '@hono/node-server'
import { Context, Env, Hono, Input } from 'hono'
import { WeatherByCity } from '../routers/WeatherByCity'
import { WeatherForecast } from '../routers/WeatherForCast'
import { Promisify, rateLimiter } from "hono-rate-limiter";
import { withCache } from '../cache/cache';
import { cors } from "hono/cors";





const app = new Hono()


const limiter = rateLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  limit: 5,
  standardHeaders: "draft-7",
  keyGenerator: function (c: Context<Env, string, Input>): Promisify<string> {
    // Get the client IP from the request headers
    const ip = c.req.header('x-forwarded-for') || 
               c.req.header('x-real-ip') || 
               'unknown';
    return Promise.resolve(ip);
  }
});


app.use('/', limiter)
app.use('/*', cors())

app.get('/', withCache(async (c) => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  return c.json({ message: "Hello, world!" });
}))
app.use('/weather', limiter)
app.use('/forecast', limiter)
app.get('/weather', withCache(WeatherByCity))
app.get('/forecast', withCache(WeatherForecast))

console.log('Server is running on http://localhost:3000')

serve({
  fetch: app.fetch,
  port: 3000,
})
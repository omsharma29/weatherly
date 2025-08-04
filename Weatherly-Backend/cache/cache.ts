const cache: Record<string, { data: any; expiry: number }> = {}
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export function withCache(handler: (c: any) => Promise<Response>) {
    return async (c: any) => {
        const key = c.req.url;
        if (cache[key] && cache[key].expiry > Date.now()) {
            console.log("Serving from cache:", key)
            return c.json(cache[key].data)
        }
        const response: any = await handler(c)
        if (response && response._data) {
            cache[key] = {
                data: response._data,
                expiry: Date.now() + CACHE_TTL,
            }
        }
        return response
    }
}



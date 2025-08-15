const cache: Record<string, { data: any; expiry: number }> = {}
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export function withCache(handler: (c: any) => Promise<Response>) {
    return async (c: any) => {
        const key = c.req.url;
        if (cache[key] && cache[key].expiry > Date.now()) {
            console.log("Serving from cache:", key)
            return c.json(cache[key].data)
        }
        
        // Call the original handler
        const response = await handler(c)
        
        try {
            // Get the response data by cloning and parsing the response
            const clonedResponse = response.clone()
            const data = await clonedResponse.json()
            
            // Store in cache
            cache[key] = {
                data: data,
                expiry: Date.now() + CACHE_TTL,
            }
        } catch (error) {
            console.error('Failed to cache response:', error)
        }
        
        return response
    }
}


type CookieWatcherOptions = {
    name: string
    onDelete: () => void
    intervalMs?: number
}

export function createCookieWatcher({name, onDelete, intervalMs = 1000}: CookieWatcherOptions) {
    alert("куку")
    let intervalId: ReturnType<typeof setInterval> | null = null
    let wasPresent = document.cookie.includes(`${name}`)

    const start = () => {
        if (intervalId) return
        intervalId = setInterval(() => {
            const isPresent = document.cookie.includes(`${name}`)
            if (wasPresent && !isPresent) {
                onDelete()
            }
            wasPresent = isPresent
        }, intervalMs)
    }

    const stop = () => {
        if (intervalId !== null) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    return {
        start,
        stop,
        isWatching: () => intervalId !== null
    }
}
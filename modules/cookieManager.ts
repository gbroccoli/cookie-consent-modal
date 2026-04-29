let _cookieName = 'c_ok';

export const CookieManager = {
    getName(): string {
        return _cookieName;
    },

    setName(newName: string) {
        if (!newName || typeof newName !== 'string') {
            throw new Error("Cookie name must be a string");
        }
        _cookieName = newName;
    }
}
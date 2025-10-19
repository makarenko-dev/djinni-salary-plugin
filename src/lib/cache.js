const store = chrome.storage.local;
export const buildKey = (vacancyUrl) => `salary:${vacancyUrl}`;

/** @param {string} key @returns {Promise<any|null>} */
export async function get(key) {
	const obj = await store.get(key);
	const hit = obj?.[key];
	if (!hit) return null;
	if (hit.exp && Date.now() > hit.exp) {
		await store.remove(key);
		return null;
	}
	return hit.v;
}

/** @param {string} key @param {any} value @param {number} ttlSec */
export async function set(key, value, ttlSec = 600) {
	const exp = ttlSec ? Date.now() + ttlSec * 1000 : 0;
	await store.set({ [key]: { v: value, exp } });
}

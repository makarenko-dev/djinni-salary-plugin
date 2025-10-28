const HOST = process.env.API_HOST;

/**
 *
 * @param {string} vacancy_url
 * @param {int} company_id
 * @returns {Promise<any>}
 */
export async function getSalary(vacancy_url, company_name) {
	const res = await fetch(`${HOST}/api/salary/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ vacancy_url, company_name }),
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`API ${res.status} ${text}`.trim());
	}
	return res.json();
}

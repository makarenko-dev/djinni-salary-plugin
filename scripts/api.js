const HOST = "http://localhost:8000";

export async function getSalary(vacancy_url, company_id) {
	const res = await fetch(`${HOST}/api/salary/`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ vacancy_url, company_id }),
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`API ${res.status} ${text}`.trim());
	}
	return res.json();
}

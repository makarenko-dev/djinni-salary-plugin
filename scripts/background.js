chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type == "SALARY_REQUEST") {
		console.log("Sending request");
		(async () => {
			const res = await fetch("http://localhost:8000/api/salary/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					vacancy_url: msg.vacancy_url,
					company_id: msg.company_id,
				}),
			});
			if (!res.ok) {
				console.log("error", res.status);
				return;
			}
			const data = await res.json();
			console.log(data);
			sendResponse({ ok: true, data });
		})();
	}
	return true;
});

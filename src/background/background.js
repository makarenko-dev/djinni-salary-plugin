import { getSalary } from "@lib/api";
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type == "SALARY_REQUEST") {
		(async () => {
			try {
				const data = await getSalary(msg.vacancy_url, msg.company_id);
				sendResponse({ ok: true, data });
			} catch (err) {
				sendResponse({ ok: false, error: "Unable to fetch" });
			}
		})();
	}
	return true;
});

import { getSalary } from "@lib/api";
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type == "SALARY_REQUEST") {
		(async () => {
			const data = await getSalary(msg.vacancy_url, msg.company_id);
			sendResponse({ ok: true, data });
		})();
	}
	return true;
});

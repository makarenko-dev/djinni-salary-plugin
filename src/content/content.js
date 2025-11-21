import { get as getCache, set as setCache, buildKey } from "@lib/cache";
import {
	createGetSalaryButton,
	createSpinner,
	createSalaryContainer,
	showTemporaryError,
} from "./ui";
await routeProcessor();

async function routeProcessor() {
	const route = location.pathname;
	const isListing =
		route === "/jobs/" ||
		route.startsWith("/jobs/company") ||
		route === "/my/dashboard/";
	if (isListing) {
		const cardSelector =
			"li:has(h2 a.job-item__title-link):not(:has(h2 strong.text-success))";
		const headingSelector = "h2";
		const urlSelector = "a.job-item__title-link";
		await enhanceAllCards(cardSelector, headingSelector, urlSelector);
	} else {
		const cardSelector = "div.page-content";
		const headingSelector = "h1";
		const card = document.querySelector(cardSelector);
		const headingEl = document.querySelector(headingSelector);
		const url = window.location.href;
		await enhanceCard(card, headingEl, url);
	}
}
async function enhanceAllCards(cardSelector, headingSelector, urlSelector) {
	await Promise.all(
		Array.from(document.querySelectorAll(cardSelector)).map((card) => {
			const headingEl = card.querySelector(headingSelector);
			const vacancyUrl = card.querySelector(urlSelector).href;
			return enhanceCard(card, headingEl, vacancyUrl);
		})
	);
}

async function sendMessageAsync(payload) {
	return new Promise((resolve, reject) => {
		chrome.runtime?.sendMessage(payload, (resp) => {
			const err = chrome.runtime.lastError;
			if (!resp.ok) {
				reject(resp.error);
			} else {
				resolve(resp);
			}
		});
	});
}

async function enhanceCard(card, headingElement, vacancyUrl) {
	if (!card) {
		return;
	}
	if (card.dataset.enhanced === "1") {
		console.log("Trying to enhance already enhanced card");
		return;
	}
	card.dataset.enhanced = "1";

	const cacheKey = buildKey(vacancyUrl);
	const cacheValue = await getCache(cacheKey);
	if (cacheValue != null) {
		headingElement.appendChild(createSalaryContainer(cacheValue));
		return;
	}
	const spinner = createSpinner();
	spinner.hidden = true;

	const button = createGetSalaryButton(async () => {
		try {
			spinner.hidden = false;
			button.hidden = true;
			const companyLink = card.querySelector(
				'a[data-analytics="company_page"]'
			).href;
			const url = new URL(companyLink);
			const parts = url.pathname.split("/").filter(Boolean);
			const companyName = parts.pop();
			const payload = {
				type: "SALARY_REQUEST",
				vacancy_url: vacancyUrl,
				company_name: companyName,
			};
			const resp = await sendMessageAsync(payload);

			const salary = resp?.data?.salary;
			if (salary) {
				// const salary
				headingElement.appendChild(
					createSalaryContainer(resp.data.salary)
				);
				await setCache(
					buildKey(vacancyUrl),
					resp.data.salary,
					60 * 60 * 24 * 7
				);
			} else {
				console.warn("No salary received", resp);
				button.hidden = false;
			}
			spinner.hidden = true;
		} catch (err) {
			spinner.hidden = true;
			button.hidden = false;
			showTemporaryError(headingElement, "Try again later");
		}
	});

	headingElement.append(button, spinner);
}

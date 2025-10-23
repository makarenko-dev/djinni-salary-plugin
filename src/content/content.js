import { get as getCache, set as setCache, buildKey } from "@lib/cache";
const CARD_SELECTOR =
	"li:has(h2 a.job-item__title-link):not(:has(h2 strong.text-success))";

await enhanceAllCards();

async function enhanceAllCards() {
	await Promise.all(
		Array.from(document.querySelectorAll(CARD_SELECTOR)).map(enhanceCard)
	);
}

function createSalaryContainer(salary) {
	const span = document.createElement("span");
	span.textContent = `$ ${salary}`;
	span.className = "text-success text-nowrap";
	return span;
}

function createGetSalaryButton(onClick) {
	const link = document.createElement("a");
	link.href = "#";
	link.role = "button";
	link.dataset.toggle = "dropdown";
	link.setAttribute("aria-expanded", "false");
	link.textContent = "Get salary";
	link.className = "get-salary-link";
	link.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		onClick();
	});
	return link;
}

function createSpinner() {
	const spinner = document.createElement("div");
	spinner.className = "spinner-border spinner-border-sm text-secondary";
	spinner.setAttribute("role", "status");
	spinner.setAttribute("aria-live", "polite");
	spinner.setAttribute("aria-busy", "true");

	const inner = document.createElement("span");
	inner.className = "visually-hidden";
	inner.textContent = "Loading...";

	spinner.appendChild(inner);
	return spinner;
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

function showTemporaryError(target, message) {
	const timeout = 3000;
	const span = document.createElement("span");
	span.textContent = `${message}`;
	span.className = "salary-error";
	target.appendChild(span);

	setTimeout(() => span.classList.add("fade-out"), timeout - 500);
	setTimeout(() => span.remove(), timeout);
}

async function enhanceCard(card) {
	if (!card) {
		return;
	}
	if (card.dataset.enhanced === "1") {
		console.log("Trying to enhance already enhanced card");
		return;
	}
	card.dataset.enhanced = "1";
	const headingElement = card.querySelector("h2");
	const vacancyUrl = card.querySelector("a.job-item__title-link").href;
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
			const jsonEl = card.querySelector(
				'a[data-analytics="company_page"]'
			).dataset.jsonParameter;
			const jsonData = JSON.parse(jsonEl.replace(/&quot;/g, '"'));
			const companyId = jsonData.company_id;
			const payload = {
				type: "SALARY_REQUEST",
				vacancy_url: vacancyUrl,
				company_id: companyId,
			};

			const resp = await sendMessageAsync(payload);

			const salary = resp?.data?.salary;
			if (salary) {
				headingElement.appendChild(
					createSalaryContainer(resp.data.salary)
				);
				await setCache(buildKey(vacancyUrl), resp.data.salary, 60 * 10);
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

const CARD_SELECTOR = "li:has(h2 a.job-item__title-link)";

addStyleOnce();
enhanceAllCards();

function addStyleOnce() {
	if (document.getElementById("salary-viewer-style")) return;
	const style = document.createElement("style");
	style.id = "salary-viewer-style";
	document.documentElement.appendChild(style);
}

function enhanceAllCards() {
	document.querySelectorAll(CARD_SELECTOR).forEach(enhanceCard);
}

function enhanceCard(card) {
	if (!card) {
		return;
	}
	if (card.dataset.enhanced === "1") {
		console.log("Trying to enhance already enhanced card");
		return;
	}
	card.dataset.enhanced = "1";
	const headingElement = card.querySelector("h2");
	const link = document.createElement("a");

	// attributes
	link.href = "#";
	link.role = "button";
	link.dataset.toggle = "dropdown";
	link.setAttribute("aria-expanded", "false");

	link.style =
		"font-size: 14px; font-weight: normal; text-decoration: none; margin-left: 8px;";
	link.textContent = "Get salary";
	link.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		const jsonString = card.querySelector(
			'a[data-analytics="company_page"]'
		).dataset.jsonParameter;
		const data = JSON.parse(jsonString.replace(/&quot;/g, '"'));
		const companyId = data.company_id;
		const vacancyUrl = card.querySelector("a.job-item__title-link").href;
		const payload = {
			type: "SALARY_REQUEST",
			vacancy_url: vacancyUrl,
			company_id: companyId,
		};
		chrome.runtime?.sendMessage(payload, (resp) => {
			link.hidden = true;
			const span = document.createElement("span");
			span.textContent = `$ ${resp.data.salary}`;
			span.classList.add("text-success");
			span.classList.add("text-nowrap");
			headingElement.appendChild(span);
		});
	});
	headingElement.appendChild(link);
}

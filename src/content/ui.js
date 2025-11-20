export function createSalaryContainer(salary) {
	const span = document.createElement("span");
	let formatted = salary;
	if (salary >= 10000) {
		formatted = `${salary}(+)`;
	}
	span.textContent = `$ ${formatted}`;
	span.className = "text-success text-nowrap";
	return span;
}

export function createGetSalaryButton(onClick) {
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

export function createSpinner() {
	const spinner = document.createElement("div");
	spinner.className = "spinner-border spinner-border-sm text-secondary";
	spinner.setAttribute("role", "status");
	spinner.setAttribute("aria-live", "polite");
	spinner.setAttribute("aria-busy", "true");
	return spinner;
}

export function showTemporaryError(target, message) {
	const timeout = 3000;
	const span = document.createElement("span");
	span.textContent = `${message}`;
	span.className = "salary-error";
	target.appendChild(span);

	setTimeout(() => span.classList.add("fade-out"), timeout - 500);
	setTimeout(() => span.remove(), timeout);
}

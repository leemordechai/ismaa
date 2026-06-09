// Adds the `in` class when the element scrolls into view (pairs with .reveal).
export function inview(node: HTMLElement, options: IntersectionObserverInit = { threshold: 0.12 }) {
	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('in');
		return {};
	}
	const io = new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (e.isIntersecting) {
				node.classList.add('in');
				io.disconnect();
			}
		}
	}, options);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}

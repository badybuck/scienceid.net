"use strict";

function eventHandler() {
	$('.tooltip').tooltipster();
	document.documentElement.addEventListener("click", function (event) {
		var target = event.target.closest(".accordion__head");
		if (!target) return;
		target.parentElement.classList.toggle("active");
	});
	document.documentElement.addEventListener("click", function (event) {
		var target = event.target.closest(".accordion-item__head");
		if (!target) return;
		target.parentElement.classList.toggle("active");
	});
	var tabs = document.querySelector('.sModel');

	if (tabs) {
		tabs.addEventListener('click', function (element) {
			var btn = element.target.closest(".diagram-block-item--js:not(.active)");
			if (!btn) return;
			var data = btn.dataset.tab;
			var content = this.querySelectorAll(".toggle-content");
			var tabsAllBtn = document.querySelectorAll(".diagram-block-item--js");
			tabsAllBtn.forEach(function (element) {
				element.dataset.tab == data ? element.classList.add('active') : element.classList.remove('active');
			});
			content.forEach(function (element) {
				// console.log(element.id);
				element.id == data ? element.classList.add('active') : element.classList.remove('active');
			});
		});
	} // $('.' + tab + '__caption').on('click', '.' + tab + '__btn:not(.active)', function (e) {
	// 	$(this)
	// 		.addClass('active').siblings().removeClass('active')
	// 		.closest('.' + tab).find('.' + tab + '__content').hide().removeClass('active')
	// 		.eq($(this).index()).fadeIn().addClass('active');
	// });

}

;

if (document.readyState !== 'loading') {
	eventHandler();
} else {
	document.addEventListener('DOMContentLoaded', eventHandler);
}
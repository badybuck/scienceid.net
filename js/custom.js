

window.onload = function () {
	window.myRadar = new Chart(document.getElementById('canvas'), config);

	$('.tooltip').tooltipster();

	document.documentElement.addEventListener("click", function(event){
		let target = event.target.closest(".accordion__head");
		if (!target) return;
		target.parentElement.classList.toggle("active");
	})

};

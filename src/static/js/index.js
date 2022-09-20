var ONLINE_CHECKING = true;

// define document width and height
var width = 450, height = 300
// create SVG document and set its size
var draw;
var arrows = new Array();

window.onload = function () {
	draw = SVG().addTo('#arrow').size(width, height);
	charge_animation();
	start_state_check();
}

function post_json(route, json) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", route, true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify(json));
}

function update_info_table(json) {
	if (json.result == 'OK') {
		document.getElementById('status_table').innerHTML = json.data
	}
}

function mark_page_dirty() {
	dirty_bit.value = '1';
}

function set_bms_online_checking(en){
	ONLINE_CHECKING = en;
	if (en) {
		setTimeout(start_state_check, 1000);
	}
}

function get_bms_online_checking(){
	return ONLINE_CHECKING;
}

function charge_animation(){
	draw.image('static/images/arrow.svg').size(500, 500).move(-35,-50);
	draw.image('static/images/arrow.svg').size(500, 500).move(75,-50);
	arrows = new Array(
		draw.image('static/images/arrow.svg'),
		draw.image('static/images/arrow.svg'),
		draw.image('static/images/arrow.svg')
	);
	draw.image('static/images/battery.svg').size(250, 250).move(0,0);
	draw.image('static/images/battery.svg').size(250, 250).move(200,0);
	arrows.forEach(function(arrow, index) {
		let multiply = 115 / arrows.length;
		arrow.size(500, 500).move(-40-(index*multiply),-50);
		arrow.animate({
			duration: 1000,
			delay: 0,
			when: 'now',
			swing: true
		}).attr({ opacity: 0 }).move(150-(index*multiply), -50);
	});

	setTimeout(charge_animation, 1000);
}

function start_state_check() {
	if (get_bms_online_checking() == true)
	{

		let xhr = new (XMLHttpRequest);
		xhr.open("GET", "update_info_table", true);
		xhr.send(null);
		fetch('/update_info_table')
			.then(response => response.json())
			.then(json => update_info_table(json));

		setTimeout(start_state_check, 1000);
	}
}

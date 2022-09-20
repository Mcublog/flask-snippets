var ONLINE_CHECKING = true;

window.onload = function () {
	set_bms_online_checking(true);
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

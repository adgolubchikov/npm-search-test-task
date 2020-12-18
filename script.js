new Vue({
	el: '#app',
	vuetify: new Vuetify()
});
const render = function (page) {
	if (typeof (page) != 'number') {
		currentPage = 1;
	} else {
		currentPage = page;
	}
	currentPackages = {};
	document.getElementById('list').innerHTML = 'Loading...';
	fetch('https://api.npms.io/v2/search?q=' + encodeURI(document.getElementById('search').value) + '&from=' + (currentPage - 1) * 10 + '&size=10').then(response => response.json()).then(data => {
		if (data.total == 0) {
			document.getElementById('list').innerHTML = 'Not found';
			return;
		} else {
			document.getElementById('list').innerHTML = '';
		}
		const table = document.createElement('table');
		const thead = document.createElement('thead');
		const tbody = document.createElement('tbody');
		thead.innerHTML = '<tr><th class="text-left">Name</th><th class="text-left">Description</th></tr>';
		table.appendChild(thead);
		for (let i = 0; i < data.results.length; i++) {
			const tr = document.createElement('tr');
			tr.innerHTML = '<td>' + data.results[i].package.name + '</td><td>' + data.results[i].package.description + '</td>';
			tr.dataset.name = data.results[i].package.name;
			currentPackages[data.results[i].package.name] = data.results[i].package;
			tr.onclick = function () {
				dialog.style.display = 'block';
				fetch('https://data.jsdelivr.com/v1/package/npm/' + this.dataset.name).then(response => response.json()).then(data => {
					document.querySelector('#dialog p').innerHTML = '<div>' + JSON.stringify(data) + '</div>' +
					'<img src="https://data.jsdelivr.com/v1/package/npm/'+this.dataset.name+'/badge?style=rounded" />' +
					'<div>Author: '+JSON.stringify(currentPackages[this.dataset.name].author)+'</div>'+
					'<div>Keywords: '+JSON.stringify(currentPackages[this.dataset.name].keywords)+'</div>'+
					'<div>Links: '+JSON.stringify(currentPackages[this.dataset.name].links)+'</div>'+
					'<div>Publisher: '+JSON.stringify(currentPackages[this.dataset.name].publisher)+'</div>'+
					'<div>Date: '+JSON.stringify(currentPackages[this.dataset.name].date)+'</div>';
				});
			};
			tbody.appendChild(tr);
		}
		table.appendChild(tbody);
		const navigation = document.getElementById('navigation');
		navigation.innerHTML = 'Page: ';
		const pages = Math.ceil(data.total / 10);
		for (let i = 1; i <= pages; i++) {
			if ((i > 3) && (i < currentPage - 3)) {
				navigation.innerHTML += ' . . . ';
				i = currentPage - 4;
				continue;
			}
			if ((i > currentPage + 3) && (i < pages - 3)) {
				navigation.innerHTML += ' . . . ';
				i = pages - 3;
				continue;
			}
			const item = document.createElement('span');
			if (currentPage == i) item.setAttribute('style', 'color: black; cursor: default;');
			item.className = 'nav-item';
			if (currentPage != i) item.setAttribute('onclick', 'render(' + i + ')');
			item.innerHTML = i;
			navigation.appendChild(item);
		}
		document.getElementById('list').appendChild(table);
	});
};
let currentPage = 1;
let currentPackages = {};
const dialog = document.getElementById('dialog');
const close = document.getElementsByClassName('close')[0];
close.onclick = function () {
	dialog.style.display = "none";
};

window.onclick = function (event) {
	if (event.target == dialog) {
		dialog.style.display = "none";
	}
};

document.getElementById('search').onkeyup = render;

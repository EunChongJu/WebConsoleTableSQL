


function showTable(json) {
	var code = '<table class="table">';
	var data = json;
	
	console.log(data);
	var headerArr = data.header.set;
	code += '<tr>';
	
	for (var i = 0; i < headerArr.length; i++) {
		code += '<th>' + headerArr[i].name + '</th>';
	}
	
	code += '</tr>';
	var rowsArr = data.data;
	for (var j = 0; j < rowsArr.length; j++) {
		var row = rowsArr[j];
		code += '<tr>';
		
		for (var k = 0; k < headerArr.length; k++) {
			var headerName = headerArr[k].name;
			console.log(row[headerName]);
			
			if (headerArr[k].type == 'date') {
				console.log('date');
				var dateStr = '';
				var dateData = row[headerName];
//				if (headerArr[k].set == 'YY/MM/DD') {
					dateStr = dateData.year + '/' + dateData.month + '/' + dateData.day;
//				}
				code += '<td>' + dateStr + '</td>';
			}
			else {
				if (row[headerName] == null) {
					code += '<td>NULL</td>';
				}
				else {
					code += '<td>' + row[headerName] + '</td>';
				}
			}
		}
		code += '</tr>';
	}
	
	code += '</table>';
	
	
	return code;
}

function show() {
	document.getElementById('table-frame').innerHTML = showTable(tableSample);
}

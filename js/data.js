

/*
// 내 생각에 DESC 테이블명;을 소환했을 때 나오는 것처럼을 구성하는 것과
// 데이터를 담는 그릇을 만들고 이를 모두 묶은 것을 테이블이라 한다.
// 또한 테이블을 묶어서 데이터베이스라 한다. 라고 정의해서 만들면 좋을 것 같다.

// JSON type
var sampleDataTableSet = function() {
	this.tableName = '';
	this.dataFieldSet = {
		id: {
			Type: "int",
			Type_size: 11,
			Null: true,
			Key: null,
			Default: 'NULL',
			Extra: null
		},
		name: {
			Type: "varchar",
			Type_size: 20,
			Null: true,
			Key: null,
			Default: 'NULL',
			Extra: null
		},
		birthday: {
			Type: "date",
			Type_size: 0,
			Null: true,
			Key: null,
			Default: 'NULL',
			Extra: null
		},
		address: {
			Type: "varchar",
			Type_size: 40,
			Null: true,
			Key: null,
			Default: 'NULL',
			Extra: null
		}
	};
//	this.dataFieldSet.prototype.length = 4;
	this.data = {
		data: [
			{
				id: 1,
				name: 'Serebrachi',
				birthday: {
					year: 1968,
					month: 6,
					day: 23
				},
				address: 'Dawning 79, NY, USA'
			},
			{
				id: 2,
				name: 'Jay Oreo',
				birthday: {
					year: 1991,
					month: 12,
					day: 26
				},
				address: 'Post Ave 83, SA, USA'
			},
			{
				id: 3,
				name: 'Hero',
				birthday: {
					year: 1989,
					month: 1,
					day: 7
				},
				address: 'Tokyo, Japan'
			},
			{
				id: 4,
				name: 'Sverige',
				birthday: {
					year: 2001,
					month: 2,
					day: 16
				},
				address: 'Stockholm, Sweden'
			},
		]
	};
//	this.data.length = 4;
	
};
var dataO = new sampleDataTableSet();
console.log(dataO.data.length);
*/






/*
function showTable(data) {
	var code = '';
	
	for (var i = 0; i < data.length; i++) {
		code += '<table class="table" id="'+ data[i].name +'">';
		var header;
		for (var j = 0; j < header.length; j++) {
			code += '<'+ j +'>';
		}
	}
	
	return code;
}
*/

var tableSample = {
	header: {
		set: [
			{
				name: 'id',
				type: 'int',
				size: 10,
				Null: false,
				Key: 'primary',	// Key: 'super', 'candidate', 'primary', 'alternate', 'foreign'
				Default: '',
				Extra: ''
			},
			{
				name: 'name',
				type: 'varchar',
				size: 12,
				Null: false,
				Key: '',	// 키에 해당되지 않으면 비워둠
				Default: '',
				Extra: ''
			},
			{
				name: 'birthday',
				type: 'date',
				format: 'YY/MM/DD',	// date일 경우 format이 사용된다.
				Null: false,
				Key: '',
				Default: '',
				Extra: ''
			},
			{
				name: 'nick',
				type: 'varchar',
				size: 15,
				Null: true,
				Key: '',
				Default: '',
				Extra: ''
			},
		]
	},
	data: [
		{
			id: 1,
			name: 'Ukraine',
			birthday: {
				year: 1991,
				month: 12,
				day: 25
			},
			nick: 'Ukraina'
		},
		{
			id: 2,
			name: 'Aki',
			birthday: {
				year: 1989,
				month: 1,
				day: 7
			},
			nick: 'Heisei'
		},
		{
			id: 3,
			name: 'Jay',
			birthday: {
				year: 1968,
				month: 6,
				day: 23
			},
			nick: 'dragon'
		},
		{
			id: 4,
			name: 'Showa',
			birthday: {
				year: 1926,
				month: 12,
				day: 25
			},
			nick: null
		}
	]
};

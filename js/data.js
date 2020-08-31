

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



// 얘는 단순히 데이터를 관리하기 위한 용도일 뿐, 직접적으로 데이터를 보여주진 않는다. 여기서 M의 역할이 된다.
// 데이터베이스의 테이블과 테이블의 데이터를 관리하는 용도
var DatabaseManagementProgram = function() {
	this.database = [];
	
	//// 데이터베이스에 있어서 사용되는 명령어 자체의 함수
	
	// 
	this.createTable = function(tableName, columns) {
		var table = {
			header: {
				name: tableName, set: []
			},
			data: []
		};
		
		if (!columns.isArray()) columns = this.setColArr(columns);
		table.header.set = columns;
		
		this.database.push(table);
	};
	
	// DROP TABLE : 테이블을 삭제 
	this.dropTable = function(tableName) {
		for (var i = 0; i < this.database.length; i++) {
			if (this.database[i].header.name == tableName) {
				var removeTable = this.database.splice(i,1);
				return removeTable.header.name;
			}
		}
	};
	
	// ALTER TABLE : 테이블을 수정
	this.alterTable = function(table) {
		
	};
	
	// 테이블을 col에 맞게 반환된다. 여기서 데이터를 바로 반환한다.
	this.selectTable = function(tableName, col) {	// tableName is String and col is Array.
		var table = this.getTable(tableName);
		var data = [];
		
		if (col == '*') {	// 전체 선택인 경우
			data = table.data;
		}
		else {	// 전체 선택이 아닌 경우
			for (var i = 0; i < col.length; i++) {
				
				data.push();
			}
		}
		
		// col이 *이냐 아니면 각자의 col 속성을 가지느냐에 따라 리턴되는 값이 달라진다.
		return data;
	};
	
	// DESC : 테이블 구조 참조
	this.descTable = function(tableName) {
		return this.getTable(tableName).header.set;
	};
	
	// 
	this.getDataTable = function(tableName) {
		for (var i = 0; i < this.database.length; i++) {
			if (this.database[i].header.name == tableName) {
				return this.database[i].data;
			}
		}
		return null;
	};
	
	// insert : 인서트 안에 VALUES 안의 데이터 배열을 col에 맞게 저장한다. 단 col이 비어있다면 형식대로 한다.
	this.insertTable = function(tableName, data, col) {
		var list;
		
		if (col.length == data.length) {
			// 여기에 col의 속성 값과 데이터 형식에 맞게 맞춰 넣는다.
			// 만약 col이 비어있다면, data는 기존의 데이터 형식에 맞춰 넣는다.
			
			if (!col) {	// col이 비어있다면 데이터 전체에 순서대로 인서트 된다.
				
			}
			else {	// col이 비버있지 않다면, col 배열에 나온 형식대로 넣는다.
				
			}
			
			for (var i = 0; i < this.database.length; i++) {
				if (this.database[i].header.name == tableName) {
					this.database[i].data.push(list);
					return true;
				}
			}
			return false;
		}
	};
	
	this.updateTable = function(tableName) {
		
	};
	
	
	
	
	
	//// 데이터베이스 함수 구성에 도움이 되거나 필요한 것
	// 검색만으로 테이블을 얻고 테이블 통째로 반환한다.
	this.getTable = function(tableName) {
		for (var i = 0; i < this.database.length; i++) {
			if (this.database[i].header.name == tableName) return this.database[i];
		}
	};
	
	
	// 칼럼의 형식에 맞게 col의 원소를 만든다.
	this.setColumn = function(name, type, formatSize, Null, Key, Default, Extra) {
		var col = {};
		
		col.name = name;
		col.type = type;
		
		if (type == 'date' || type == 'datetime' || type == 'time') col.format = formatSize;
		else col.size = formatSize;
		
		if (Null != null) col.Null = Null;
		if (Key) col.Key = Key;
		if (Default) col.Default = Default;
		if (Extra) col.Extra = Extra;
		
		return col;
	};
	
	// col의 원소들을 모아 배열로 만든다.
	this.setColArr = function(columns) {
		var columnArr = [];
		
		for (var i = 0; i < columns.length; i++) {
			var column = columns[i];
			columnArr.push(this.setColumn(column.name, column.type, column.formatSize, column.Null, column.Key, column.Default, column.Extra));
		}
		return columnArr;
	};
	
	
};

// 이를 생성자로 새로 생성하는 것은 새로운 데이터베이스를 생성하는 것과 같다.
var database = new DatabaseManagementProgram();



var SQL = function() {
	var tableDataArr = new Array();
	
	var tableSample = {
		"name": '',	// Table Name
		"attr": [],	// Table Attribute
		"data": []	// Table Tuples
	};
	
	var tableAttrSample = {	// It's' element of in the table attr array
		"name": '',
		"type": "",	// varchar, char, int, string ...
		"format": 0,	// varchar, char, int is use number of length. date is use ex to 'YY/MM/DD'
		"null": false,	// true or false
		"key": '',	// Key: 'super', 'candidate', 'primary', 'alternate', 'foreign'
		"default": '',
		"extra": ''
	};
	
	
	// v is null that return true, is not null that return false. And not is added return not isNull()
	this.isNull = function(v) {
		return (v === undefined || v === null);
	};
	this.isNotNull = function(v) {
		return !this.isNull(v);
	};
	
	
	
	this.getTableIndex = function(tableName) {
		for (var i = 0; i < tableDataArr.length; i++) {
			if (tableDataArr[i].name === tableName) {
				return i;
			}
		}
		
		return -1;
	};
	
	this.getTable = function(tableName) {
		var index = this.getTableIndex(tableName);
		
		try {
			return tableDataArr[index];
		}
		catch(e) {
			return index;
		}
	};
	
	this.getTableAttr = function(tableName) {
		var table = this.getTable(tableName);
		
		if (table === -1) return null;
		
		return table.attr;
	};
	
	this.setTable = function(tableName, tableData) {
		var index = this.getTableIndex(tableName);
		
		if (index === -1) return false;
		
		try {
			tableDataArr[index] = tableData;
			return true;
		}
		catch(e) {
			return false;
		}
	};
	
	// DDL
	this.create = function(tableName, tableAttr) {
		var newTable = tableSample;	// load tableSample to new variable for newTable
		
		newTable.name = tableName;
		newTable.attr = tableAttr;
		
		
	}
	
	this.alter = function(tableName, tableAttr) {
		var tmpTable = this.getTable(tableName);
		tmpTable.attr = tableAttr;
		
		return this.setTable(tmpTable);
	}
	
	this.drop = function(tableName) {
		var index = this.getTableIndex(tableName);
		
		if (index === -1)
		
		try {
			tableDataArr.splice(index, 1);
			return true;
		}
		catch(e) {
			return false;
		}
	}
	
	// DML
	this.select = function() {
		
	}
	
	this.insert = function() {
		
	}
	
	this.update = function() {
		
	}
	
	this.delete = function() {
		
	}
	
	// DCL
	this.grant = function() {
		
	}
	
	this.revoke = function() {
		
	}
	
	this.cascade = function() {
		
	}
	
	this.restricted = function() {
		
	}
	
}

var sql = new SQL();

console.log(sql.create('SQL', []));
console.log(sql.getTable('SQL'));

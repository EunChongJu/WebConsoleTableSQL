

var SQL = function () {
	'use strict';
	
	var tableDataArr = [];
	
	this.getSampleTable = function() {
		return {
			"name": '',
			"attr": [],
			"data": []
		};
	};
	
	this.getSampleAttr = function() {
		return {
			"name": '',
			"type": "",	// varchar, char, int, string ...
			"format": 0,	// varchar, char, int is use number of length. date is use ex to 'YY/MM/DD'
			"null": false,	// true or false
			"key": '',	// Key: 'super', 'candidate', 'primary', 'alternate', 'foreign'
			"default": '',
			"extra": ''
		};
	};
	
	this.getSampleData = function(attrName, domain, key, extra) {
		return {
			"attr": attrName,
			"domain": domain,
			"key": key,
			"extra": extra
		};
	};
	
	// v is null that return true, is not null that return false. And not is added return not isNull()
	this.isNull = function(v) {
		return (v === undefined || v === null);
	};
	this.isNotNull = function(v) {
		return !this.isNull(v);
	};
	
	// ONLY TEST
	this.getTableAll = function() {
		var arr = [];
		for (var i = 0; i < tableDataArr.length; i++) arr.push(tableDataArr[i]);
		return arr;
	};
	
	this.getTableIndex = function(tableName) {
		for (var i = 0; i < tableDataArr.length; i++) {
			if (tableDataArr[i].name == tableName) {
				return i;
			}
		}
		
		return -1;
	};
	
	this.getTable = function(tableName) {
		var index = this.getTableIndex(tableName);
		
		if (index != -1) return tableDataArr[index];
		
		return null;
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
		var newTable = this.getSampleTable();	// load tableSample to new variable for newTable
		
		newTable.name = tableName;
		newTable.attr = tableAttr;
		
		try {
			tableDataArr.push(newTable);
			return true;
		}
		catch(e) {
			return false;
		}
	}
	
	this.alter = function(tableName, tableAttr) {
		var tmpTable = this.getTable(tableName);
		tmpTable.attr = tableAttr;
		
		var result = this.setTable(tableName, tmpTable);
		return result;
	}
	
	this.drop = function(tableName) {
		var index = this.getTableIndex(tableName);
		
		if (index == -1) return false;
		
		try {
			tableDataArr.splice(index, 1);
			return true;
		}
		catch(e) {
			return false;
		}
	};
	
	// DML
	this.select = function(tableName, options) {
		// SELECT function have problems, how to have done FROM and WHERE functions?
		var table = this.getTable(tableName);
		var arr = new Array();
		
		for (var i = 0; i < options.length; i++) {	// options is array, about attr
			for (var j = 0; j < table.data.length; j++) {
				arr.push(table.data[j](options[i]));
			}
		}
		
		return arr;
	}
	
	this.insert = function(tableName, tuples) {
		var table = this.getTable(tableName);
		var result = false;
		
		if (tuples.length != 0) {
			for (var i = 0; i < tuples.length; i++) {
				table.data.push(tuples[i]);
			}
		}
		
		try {
			// Table Update: ALTER TABLE
			return !result;
		}
		catch(e) {
			// return fasle;
			return result;
		}
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


var console = function() {
	this.log = function(data) {
		console.log(data);
	};
	this.dir = function(data) {
		console.log(data);
	};
};

// EXPERIMENT TEST ZONE
function test() {
	var sql = new SQL();
	
	// CREATE TABLE and like SELECT
	console.log('CREATE TABLE SQL');
	console.log(sql.create('SQL', []));
	
	console.log(sql.getTable('SQL'));
	console.log(sql.getTable('SQK'));
	
	console.log('-----------------');
	
	// ALTER TABLE
	console.log(sql.alter('SQL', [1,2,3]));
	console.log(sql.getTable('SQL'));
	console.log(sql.getTableAll());
	
	console.log('-----------------');
	
	// DROP TABLE
	console.log(sql.create('SQK', ['A', 'B', 'C', 'D', 'E']));
	// ERROR: create() is changing before table to new table.
	
	console.log(sql.getTable('SQK'));
	console.log(sql.getTableAll());
	
	console.log(sql.drop('SQK'));
	console.log(sql.getTable('SQK'));
	console.log(sql.getTableAll());
	
	console.log('-----------------');
}

test();

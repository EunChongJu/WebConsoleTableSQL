/*
'use-strict';

var SQLParser = function() {
	this.version = function() {
		return '1.0.0';
	};
	
	this.split = function(str) {
		return str.split(" ");
	};
};

var parser = new SQLParser();

console.log(parser.version());

function queryActive() {
	var str = document.getElementById('query').value;
	console.log(str);
}
*/



function parserProgram(str) {
	var charArr = [];
	charArr = str.split('');
	
	console.log(charArr);
	
	var sqlStatementArr = [];
	var sqlStatement = '';
	
	for (var i = 0; i < charArr.length; i++) {
		var char = charArr[i];
		var charNum = char.charCodeAt(0);
		
		if (charNum == 32) {	// 띄어쓰기 공백
			if (sqlStatement) {
				sqlStatementArr.push(sqlStatement);
				sqlStatement = '';
			}
		}
		else if (charNum == 9) {	// 탭 공백
			sqlStatementArr.push(sqlStatement);
			sqlStatement = '';
		}
		else if (charNum == 40) {	// (
			sqlStatementArr.push(sqlStatement);
			sqlStatement = '';
			sqlStatementArr.push('(');
		}
		else if (charNum == 41) {	// )
			sqlStatementArr.push(sqlStatement);
			sqlStatement = '';
			sqlStatementArr.push(')');
		}
		else if (charNum == 59) {	// ;
			sqlStatementArr.push(sqlStatement);
			sqlStatement = '';
			sqlStatementArr.push(';');
		}
		else if (charNum == 44) {	// ,
			sqlStatementArr.push(sqlStatement);
			sqlStatement = '';
			sqlStatementArr.push(',');
		}
		else if (charNum == 60) {	// <
			if (sqlStatement) {	// 그 전 부호에 구문이나 등이 존재하면 먼저 이것부터 저장한다.
				sqlStatementArr.push(sqlStatement);
				sqlStatement = '';
			}
			sqlStatement += char;
		}
		else if (charNum == 62) {	// >
			if (sqlStatement == '<') {
				sqlStatement += char;
				sqlStatementArr.push(sqlStatement);
				sqlStatement = '';
			}
		}
		else if (charNum == 42) {	// *
			sqlStatementArr.push(char);
		}
		else if (charNum == 61) {	// =
			sqlStatementArr.push(char);
			
		}
		/*
		else if (charNum == 0) {	// 나중에 필요할 때 사용하기 위한 공백
			
		}
		*/
		else {
			sqlStatement += char;
		}
	}
	
	console.log(sqlStatementArr);
}

parserProgram('SELECT * FROM tableSample;');
parserProgram('SELECT query Col FROM sample21;');
parserProgram('SELECT * FROM tableSample WHERE Quote = 2 ORDER BY Quote ASC or DESC;');
// Find Bug: 'A=B' is begin to '=', 'AB'; Do have a space on both sides.
parserProgram('SELECT view FROM sample WHERE Col = 3.14 ORDER BY Col ASC or DESC LIMIT 5;');

parserProgram('INSERT INTO table_Student (Name, Class, Age) VALUES ("Jane","A",16);');
parserProgram("INSERT INTO table_Student (Name, Class, Age) VALUES ('Jane','A',16);");
// It's no problem that small and big is different.
parserProgram("INSERT INTO table_Student value ('Jane','A',16);");

parserProgram('UPDATE tableSample SET val = "SW";');
parserProgram('UPDATE tableShow SET vista = "NULL" WHERE SET = "EXCHANGE";');
// Can use Unicode...
parserProgram('UPDATE 테이블명 SET 컬럼명1 = 변경할 값1,컬럼명2 = 변경할 값2 WHERE 컬럼명=값;');

parserProgram('DELETE from sample21;');
parserProgram('DELETE from table WHERE column = "value";');
parserProgram('');

/*
function charAtType() {
	
	for (var i = 0; i < charArr.length; i++) {
		var char = charArr[i].charCodeAt(0);
		
		if (char == 32) {	// 띄어쓰기 공백
			sqlStatementArr.push(sqlStatement);
			sqlStatement = '';
		}
		else if (char == 9) {	// 탭 공백
			
		}
		else if (char == 33) {	// !
			
		}
		else if (char == 40) {	// (
			
		}
		else if (char == 41) {	// )
			
		}
		else if (char == 63) {	// ?
			
		}
		else if (char == 59) {	// ;
			
		}
		else if (char == 44) {	// ,
			
		}
		else if (char == 46) {	// .
			
		}
		else if (char == 58) {	// :
			
		}
		else if (char == 60) {	// <
			
		}
		else if (char == 62) {	// >
			
		}
		else if (char == 123) {	// {
			
		}
		else if (char == 125) {	// }
			
		}
		else if (char == 91) {	// [
			
		}
		else if (char == 93) {	// ]
			
		}
		else if (char == 42) {	// *
			
		}
		else if (char == 61) {	// =
			
		}
		else if (char == 43) {	// +
			
		}
		else if (char == 45) {	// -
			
		}
		else if (char == 47) {	// /
			
		}
		else if (char == 95) {	// _
			
		}
		else if (char == 35) {	// #
			
		}
		else if (char == 64) {	// @
			
		}
		else if (char == 36) {	// $
			
		}
		else if (char == 37) {	// %
			
		}
		else if (char == 94) {	// ^
			
		}
		else if (char == 38) {	// &
			
		}
		else if (char == 126) {	// ~
			
		}
		else if (char == 96) {	// `
			
		}
		else if (char == 34) {	// "
			
		}
		else if (char == 39) {	// '
			
		}
		else if (char == 0) {	// 나중에 필요할 때 사용하기 위한 공백
			
		}
		else {
			if (char >= 65 && char <= 90) {	// 대문자
				
			}
			else if (char >= 97 && char <= 122) {	// 소문자
				
			}
		}
	}
}
*/













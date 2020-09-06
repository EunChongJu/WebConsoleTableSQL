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

// 이 파일은 구문 분석과 해석을 하는 프로그램이 있으며, 다음과 같은 흐름으로 처리되는 시스템이 한 파일을 이룬다.
// 첫번째로 명령어를 한 char씩 나눈 다음, 스페이스바로 구분된 구문을 나누어 배열로 반환한다.
// 그 다음, 두번째로 나눈 구문을 해석하여 어떤 함수를 실행하고 어떻게 처리할지 파악한다.
// 세번째로 어떤 함수가 어떻게 처리될지 결정되면, 실행할 함수의 형식에 맞게 정리한다.
// 네번째로 함수에 맞는 형식이 정리된 데이터 등을 파라미터로 함수를 호출한다.
// 다섯번째로 함수를 호출하면, 호출한 시점에서 function.js가 처리한다. (function은 직접적으로 데이터를 다루지 않음)
// 여섯번째로 function.js가 처리 완료한 데이터를 반환받는다.
// 일곱번째로 반환받은 데이터를 view.js에게 넘긴다. (view는 데이터를 테이블 형식에 맞춰 호출함)
// 이와 같이 이 흐름으로 시스템이 작동한다.
// 만약 시스템이 작동되지 않으면, 이 흐름이 끊겼다고 간주하면 된다.
// 작동되지 않는 것에 대해서 테이블 출력이 아닌 에러를 출력하도록 할 것이다.

// 아마 여기서 구문 분석에 필요할 알고리즘으로는 여러가지가 있다.

// 아마 구문 분석에서는 괄호에 의한 순서 알고리즘이 대표적으로 사용될 것이다.

// 아래의 함수는 임시용 프로토타입일 뿐이다.

// Parser Program
function parserProgram(str) {
	var charArr = [];
	charArr = str.split('');
//	console.log(charArr);
	
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
	
	// 구문 파서 완료 확인
//	console.log(sqlStatementArr);
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

parserProgram('SELECT * FROM sample21 WHERE birthday IS NULL;');

parserProgram('SELECT * FROM sample23 WHERE no = 1;');
parserProgram('SELECT * FROM sample23 WHERE no <> 1;');
parserProgram('SELECT * FROM sample23 WHERE no < 1;');
parserProgram('SELECT * FROM sample23 WHERE no > 1;');
parserProgram('SELECT * FROM sample23 WHERE no >= 1;');
parserProgram('SELECT * FROM sample23 WHERE no <= 1;');

parserProgram('SELECT * FROM sample24 WHERE a <> 0 AND b <> 0;');
parserProgram('SELECT * FROM sample24 WHERE a = 1 OR a = 2;');
parserProgram('SELECT * FROM sample24 WHERE (a=1 OR a=2) AND (b=1 OR b=2);');
parserProgram('SELECT * FROM sample24 WHERE NOT(a<>0 OR b<>0);');
parserProgram("SELECT * FROM sample25 WHERE text LIKE 'SQL%';");	// In facts, It have use D.Q.(") All
parserProgram("SELECT * FROM sample25 WHERE text LIKE '%SQL%';");	// '\%' => '%'
parserProgram("SELECT * FROM sample25 WHERE text LIKE '%\%%';");	// ' == ''''

parserProgram("SELECT * FROM sample26 WHERE a=1 ORDER BY address;");
parserProgram("SELECT * FROM sample26 ORDER BY address;");
parserProgram("SELECT * FROM sample26 ORDER BY age DESC;");
parserProgram("SELECT * FROM sample26 ORDER BY age ASC;");
parserProgram("SELECT * FROM sample27 ORDER BY a, b;");	// 1 1, 1 2, 1 3, 2 1, 2 3, 3 1
parserProgram("SELECT * FROM sample27 ORDER BY a ASC, b DESC;");	// 1 3, 1 2, 1 1, 2 3, 2 1, 3 1

parserProgram("SELECT * FROM sample28 LIMIT 3;");	// long info use LIMIT, short and groups or pages
parserProgram("SELECT * FROM sample28 ORDER BY no DESC LIMIT 3;");
parserProgram("SELECT * FROM sample28 WHERE ROWNUM <= 3;");	// It's for Oracle, SQL Server use TOP.
parserProgram("SELECT * FROM sample28 LIMIT 3 OFFSET 3;");

parserProgram("SELECT *, price * quantity FROM sample29;");	// * and price*quantity column
parserProgram("SELECT *, price * quantity AS amount FROM sample29;");	// p.*q. change to amount
parserProgram('SELECT price * quantity "GoldEq." FROM sample29;');	// Single quote is for String
parserProgram('SELECT price * quantity AS "SELECT" FROM sample29;');	// Double quote is for Object
parserProgram("SELECT *, price * quantity AS amount FROM sample29;");
parserProgram("SELECT *, price * quantity AS amount FROM sample29 WHERE price * quantity >= 2000;");

parserProgram("SELECT *, price * quantity AS amount FROM sample29 WHERE amount >= 2000;");
// ERROR: DB is working stream how to: WHERE -> SELECT -> ORDER BY.

// 0/1 = 'division by zero' error. but, 1/NULL result is NULL.
parserProgram('SELECT *, price * quantity AS amount FROM sample29 ORDER BY price * quantity DESC;');
parserProgram('SELECT *, price * quantity AS amount FROM sample29 ORDER BY amount DESC;');

parserProgram('SELECT amount, ROUND(amount) FROM sample30;');	// DECIMAL is can display float.
parserProgram('SELECT amount, ROUND(amount, 1) FROM sample30;');	// TRUNCATE is delete float.
parserProgram('SELECT amount, ROUND(amount, -2) FROM sample30;');

parserProgram('SELECT CONCAT(quantity, unit) FROM sample31;');	// Oracle: q||u, SQL Server: q+u
parserProgram("SUBSTRING('19890117002', 1, 4)");	// => '1989'
parserProgram("SUBSTRING('19890117002', 5, 2)");	// => '02'
parserProgram("TRIM('ABC   ')");	// => 'ABC'
parserProgram('CHARACTER_LENGTH');	// 이것은 문자 단위로 문자열의 길이를, OCTET_LENGTH는 바이트 단위로 계산

parserProgram('SELECT CURRENT_TIMESTAMP;');	// result: check system time now
parserProgram("TO_DATE('2014/01/25', 'YYYY/MM/DD');");
parserProgram('SELECT CURRENT_DATE + INTERVAL 1 DAY');	// realtime + 1 Day
parserProgram('SELECT a, CASE WHEN a IS NULL THEN 0 ELSE a END "a(null=0)" FROM sample37;');
parserProgram('SELECT a, COALESCE(a,0) FROM sample37;');
// It's do that if a isn't NULL, result a. if a is null, result 0.

parserProgram('SELECT a AS "CODE", CASE WHEN a=1 THEN \'male\' WHEN a=2 THEN \'female\' ELSE \'NotSelect\' END AS "gender" * FROM sample37;');	// 1 or 2; if not 1 or 2, result: NotSelect
parserProgram('SELECT a AS "CODE", CASE a WHEN 1 THEN \'male\' WHEN 2 THEN \'female\' ELSE \'NotSelect\' END AS "gender" FROM sample32;');	// 주의: ELSE를 반드시 지정해야 함. 안그러면 NULL이 지정됨
parserProgram('SELECT a AS "CODE", CASE a WHEN a = 1 THEN \'male\' WHEN a = 2 THEN \'female\' WHEN a IS NULL THEN \'Nothing Data\' ELSE \'NotSelect\' END AS "gender" FROM sample32;');	// IF IS NULL: THEN

parserProgram('INSERT INTO sample40(no,d) VALUES(2, DEFAULT);');	// use default for save value
parserProgram('DELETE FROM sample41;');		// delete table sample41
parserProgram('DELETE FROM sample41 WHERE no = 3;');	// delete it that row is no=3
parserProgram("UPDATE sample41 SET b = '2014-09-07' WHERE no = 2;");
parserProgram('UPDATE sample41 SET no = no + 1;');	// update result: no += 1 (because not use WHERE)
parserProgram('UPDATE sample41 SET no = no + 1, a = no;');
parserProgram('UPDATE sample41 SET a = no, no = no + 1;');
parserProgram('UPDATE sample41 SET no = no + 1, a = no;');
parserProgram('UPDATE sample41 SET a = no, no = no + 1;');
parserProgram('UPDATE sample41 SET a = NULL;');

parserProgram('');
parserProgram('');
parserProgram('');
parserProgram('');
parserProgram('');
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
			return;
		}
		else if (char == 33) {	// !
			return;
		}
		else if (char == 40) {	// (
			return;
		}
		else if (char == 41) {	// )
			return;
		}
		else if (char == 63) {	// ?
			return;
		}
		else if (char == 59) {	// ;
			return;
		}
		else if (char == 44) {	// ,
			return;
		}
		else if (char == 46) {	// .
			return;
		}
		else if (char == 58) {	// :
			return;
		}
		else if (char == 60) {	// <
			return;
		}
		else if (char == 62) {	// >
			return;
		}
		else if (char == 123) {	// {
			return;
		}
		else if (char == 125) {	// }
			return;
		}
		else if (char == 91) {	// [
			return;
		}
		else if (char == 93) {	// ]
			return;
		}
		else if (char == 42) {	// *
			return;
		}
		else if (char == 61) {	// =
			return;
		}
		else if (char == 43) {	// +
			return;
		}
		else if (char == 45) {	// -
			return;
		}
		else if (char == 47) {	// /
			return;
		}
		else if (char == 95) {	// _
			return;
		}
		else if (char == 35) {	// #
			return;
		}
		else if (char == 64) {	// @
			return;
		}
		else if (char == 36) {	// $
			return;
		}
		else if (char == 37) {	// %
			return;
		}
		else if (char == 94) {	// ^
			return;
		}
		else if (char == 38) {	// &
			return;
		}
		else if (char == 126) {	// ~
			return;
		}
		else if (char == 96) {	// `
			return;
		}
		else if (char == 34) {	// "
			return;
		}
		else if (char == 39) {	// '
			return;
		}
		else if (char == 0) {	// 나중에 필요할 때 사용하기 위한 공백
			return;
		}
		else {
			if (char >= 65 && char <= 90) {	// 대문자
				return;
			}
			else if (char >= 97 && char <= 122) {	// 소문자
				return;
			}
		}
	}
}
*/













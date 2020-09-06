
// SQL 명령어는 다음과 같이 세가지로 나눌 수 있다.

/*
- DML: 데이터 조작
	Data Manipulation Language의 약자.
	DB에 새롭게 데이터를 추가하거나 삭제하거나 내용을 갱신하는 등, 데이터를 조작할 때 사용합니다.
	SQL의 가장 기본이 되는 명령 셋(set)임.
	
- DDL: 데이터 정의
	Data Definition Language의 약자로 데이터를 정의하는 명령어.
	DB는 '데이터베이스 객체(object)'라는 데이터 그릇을 이용하여 데이터를 관리하는데, 이 같은 객체를 만들거나 삭제하는 명령어.

- DCL: 데이터베이스 제어
	Data Control Language의 약자로 데이터를 제어하는 명령어.
	DCL에는 트랜잭션을 제어하는 명령어와 데이터 접근권한을 제어하는 명령이 포함되있음. (트랜잭션은 8장에)

이와 같이 명령어가 그렇게 나뉜다. 마찬가지로 여기에 사용되거나 설계할 때 사용될 함수들도 이에 맞게 설계되야 할 필요가 있다.

일단 이의 구조를 이와 같이 분류하여 작동하도록 한다.
- parser.js
	SQL의 명령어를 맨 처음 호출되어 받는 곳이며, 구문을 분석하여 알맞은 함수를 실행한다.
	- 먼저 받은 명령구문을 한글자 한글자 쪼개 배열에 저장한다.
	- 문자 1개씩 있는 배열을 앞 뒤 전후문자를 분석하여 알맞은 구문 단위로 배열에 저장된다.
	
	이는 단순히 스페이스바 기준으로 문자열을 배열로 나눈 것보다 더 정확하고 효율적으로 구문을 나눌 수 있다는 점이 있다.
	
	그 다음, 그렇게 구문별로 나누어진 배열의 명령어를 타입에 따라 테이블을 호출하거나 삽입, 삭제, 갱신한다.
	- SELECT라면 먼저 FROM 뒤에 있는 테이블 이름을 통해 해당 테이블을 불러낸다.
	- 그 다음, SELECT 다음에 있는 col 형태에 따라 데이터가 걸러진다.
	- 여기서 col은 *이므로 전체 테이블을 반환하게 되고, view.js를 거쳐 유저에게 보여진다.
	
	- INSERT라면 
		INSERT INTO sample21 (no, a, b) VALUES(1, 'ABC', '2014-01-25');
		INSERT INTO sample21 VALUES(1, 'ABC', '2014-01-25');
		- 이 경우 생략되지 않았다면 데이터가 바로 매칭되도록 삽입한다.
		- 생략된 경우, 테이블 칼럼 순으로 데이터를 삽입한다.
	
	- WHERE라면
		여기서 WHERE에 대해서 처리하는 방법을 알려줄 것이다.
		- SELECT 등을 통해 처리되고 반환된 테이블을 받아 WHERE 구문에 따라 처리될 것이다.
		- WHERE text LIKE '%USA%';라면 text 열 만을 가져와 중간일치하는 것을 찾아 매칭되는 행을 따로 모아 반환한다.
		WHERE (a=1 OR a=2) AND (b=1 OR b=2);라면
		- 우선순위에 따라 괄호 안에 있는 것부터 해당하는 행을 모으고, AND 연산자를 통해 행을 걸러낸다. -> 약간 비효율적이다.
		- 우선순위를 분석하고, a가 1 또는 2인 것과 동시에 b가 1 또는 2인 것을 동시에 매칭되는 행을 찾아내는 것이다.
		- (아마 높은 확률로 a또는 b 하나라도 틀리면 바로 넘어가도록 할 수 있다. 시간상 효율성을 위해서)
	
	
- view.js
	SQL의 명령어를 처리한 결과를 디스플레이에 표시한다. View와 같다.
- data.js
	SQL의 명령어에 있어서 테이블과 테이블의 데이터를 관리하고 값을 반환한다. 여기서 Model의 역할과 같다.
- function.js
	SQL의 명령어에 있어서 데이터를 얻어서 서브쿼리 등 명령 구문에 맞게 데이터를 가공하고 반환한다.


일단 이 구조로 봐선 데이터베이스 안에 여러개의 테이블이 있고, 테이블을 추가하고 삭제하고 값을 바꾸는 것을 data.js가 맡는다.
아니 DatabaseManagementPrograme이라 하여 얘가 관리하도록 한다.

SQL 구문을 함수로 호출 할 수 있도록 하는 것을 function.js가 맡는다.
function.js 안에 SELECT에 해당하는 함수를 호출하면 테이블에 데이터를 불러내는 것은 data.js가 맡아 데이터를 반환하도록 한다.

parser.js가 하는 일은 구문을 분석하고 알맞은 함수를 function.js에서 호출하는 것이다.
parser.js는 하는 일을 끝내면 마지막에 view.js를 호출하도록 한다.

처리 방식은 다음과 같이 해결하면 될 것이다.
SELECT (a, b, c) FROM sample21 WHERE b IS NOT NULL AND c <> 0
- 모든 구문을 나누어 배열에 저장한다. (SELECT 다음에 오는 괄호 안의 쉼표는 생략된다. 단지 어떤 칼럼만 표시할 지만 알면 되니깐.)
=> ['SELECT', '(', 'a', 'b', 'c', ')', 'FROM', 'sample21', 'WHERE', 'b', 'IS', 'NOT', 'NULL', 'AND', 'c', '<>', '0']

- 그 다음, 맨 앞 구문이 SELECT임을 확인한다.

- FROM 뒤에 있는 테이블 이름을 가져와 function.js 또는 data.js를 통해 SELECT 기능을 하는 함수를 호출하여 해당 테이블 데이터를 가져온다.

- WHERE 다음에 있는 구문을 분석한다.
b IS NOT NULL AND c <> 0
-> (b IS NOT NULL) AND (c <> 0) -> (NOT (b IS NULL)) AND (c != 0) -> And(Not(IsNull(b)), Not(equals(c, 0)))

- 이런 식으로 WHERE는 위와 같이 처리한다. true가 나오는 행만 반환할 수 있게 한다.
- 그 다음, 표시될 칼럼을 분석하여 칼럼을 잘라내 반환한다. ex) col(...)(cols);
- 처리가 완료되면, 해당 테이블 처리 결과는 view.js로 넘겨진다.
- 결과 값이 표시된다.

*/



/*
혹시 모르니 달아놓는 팁이나 주의사항, 경고 등
* 여기서는 내부 처리 순서에 대해 알아볼 것이다.
그래야 개발에 있어서 문제가 발생하거나 순서 충돌을 미연에 예방을 할 수 있을 것이라 본다.

WHERE 구 -> SELECT 구 : WHERE 구 행 추출 -> SELECT 구: 열을 선택해 별명을 붙임

* AS 구문을 통해 계산
SELECT *, price * quantity AS amount FROM sample34 ORDER BY amount DESC;
이 경우에는 WHERE -> SELECT -> ORDER BY 순으로 처리된다.
ORDER BY 구에서는 SELECT 구에서 지정한 별명을 사용할 수 있다.

* NULL 값의 연산
NULL 값의 연산에서 나눗셈이나 덧셈 등 계산을 해 보아도 공통적으로 NULL로 연산하면 NULL이 된다!

*/



// var DatabaseManagementProgram = DatabaseManagementProgram();

var SQLProgram = function() {
	// Data Sample for Data Set.
	this.dataSetType = {
		"INTEGER": [],
		"CHAR": [],
		"VARCHAR": [],
		"DATE": {},
		"TIME": {},
		"DATETIME": {},
		"DECIMAL": {}
	};
	// Data Sample for Data Arr.
	this.dataType = {
		"INTEGER": 0,
		"CHAR": '',
		"VARCHAR": '',
		"DATE": {
			"YEAR": 4000, "MONTH": 12, "DAY": 31	// YEAR는 서력기원을 사용, 기원전은 -로 표기하고 0은 없다.
		},
		"TIME": {
			"HOUR": 24, "MINUTE": 60, "SECOND": 60
		},
		"DATETIME": {
			"YEAR": 4000, "MONTH": 12, "DAY": 31, "HOUR": 24, "MINUTE": 60, "SECOND": 60
		},
		"DECIMAL": 0.0
	};
	
	this.DBMS = null;
	
	// 아마 여기에 SQL Program을 생성하는 즉시 하나의 데이터베이스가 생성되는 것이다.
	// 이 프로그램 안에 여러 개의 테이블을 관리하는 것이여야 한다.
	// 그래서 function.js 안에 있는 SQL Program이 하나의 데이터베이스로 행동해야 한다.
	
	
	//// 여기는 생성자 자리
	// 자바에서 생성자 같은 시작 함수
	this.start = function() {
		// 여기서 data.js의 모든 프로토타입을 생성자로 호출하여 SQLProgram에 저장된다.
		// DatabaseManagementProgram
		
		this.DBMS = new DatabaseManagementProgram();
	}
	
	//// 테이블 관리
	// 테이블을 생성
	this.createTable = function() {
		
		// create table 명령 구문에서 col과 data 등의 형식에 맞게 처리한 다음,
		// 테이블을 생성하는 함수를 호출한다.
		this.DBMS.createTable(tableName, columns);
		
	}
	
	// 테이블을 삭제
	this.dropTable = function() {
		
		
		this.DBMS.dropTable();
	}
	
	// 테이블을 변경
	this.alterTable = function() {
		
		
		this.DBMS.alterTable();
	}
	
	
	//// 테이블 데이터 관리
	// SELECT : 테이블 데이터를 조회
	this.select = function(tableName) {
		return function(cols) {
			var colsArr = cols;
			return colsArr;
		};
	};
	
	// WHERE : 데이터에서 조건에 부합하는 값을 찾기
	this.where = function(gm) {
		if (gm) return;
	};
	
	// INSERT : 데이터 삽입 (추가)
	this.insert = function(tableName) {
		return function(values) {
			var valArr = values;
			return valArr;
		};
	};
	
	// DELETE : 데이터 삭제 (WHERE를 써서 삭제하도록 한다. 차후 논리 삭제 개념을 도입할 것임)
	this.delete = function() {
		
	};
	
	// UPDATE : 데이터 갱신 (데이터를 갱신하도록 한다. 역시 WHERE를 사용하여 처리함)
	this.update = function() {
		
	};
	
	
	// DESC : 테이블 
	this.desc = function(tableName) {
		// 대충 어떻게 해서 테이블 이름과 일치한 것을 찾았으면 이 테이블의 속성(DESC)을 배열로 반환하도록 한다.
		var resultArr = [];
		
		return resultArr;
	};
	
	// 테이블 열에 이러한 열의 이름이 있는지 확인하기 위함
	this.isColumn = function(cols) {
		// 대충 어떻게 해서 DESC table 명령과 같이 받았다 치자.
		var descArr = [];
		
		for (var i = 0; i < descArr.length; i++) {
			if (cols === descArr[i].name) {
				return true;
			}
		}
		
		return false;
	}
	
	
	// IS NULL : NULL 값 검색
	this.isNull = function(cols) {
		// NULL인 col 데이터 값만 반환한다.
	};
	
	// IS NOT NULL : NULL이 아닌 값 검색
	this.isNotNull = function(cols) {
		// isNull과는 다르게 함수는 아니지만 IS NOT NULL을 지원하기 위함
	};
	
	
	// LIKE : 패턴 매칭
	this.like = function(col, pattern) {
		
	};
	
	
	
	// EXISTS : 상관 서브쿼리
	this.exists = function() {
		
	}
	this.notExists = function() {
		
	}
	this.in = function() {
		
	}
	
	
	// AS : 열의 별명
	// SELECT *, price * quantity FROM sample34;라고 지정하면 새로운 칼럼이 생긴다.
	// 생기는 칼럼에 이름(별명)을 붙일 수 있게 하는 것이 AS이다.
	// SELECT *, price * quantity AS "amount" FROM sample34;
	// 그리고 칼럼을 새로 생기게 하고, 별명을 붙일 수 있게 하는 것은 어떻게 하면 좋을까??
	
	
	//// 문자열 연산
	// 문자열 결합
	// 문자열 결합에서 연산자는 다양한데, +, ||, CONCAT이 있다. 방언임.
	// SELECT CONCAT(quantity, unit) FROM sample35;
	
	// SUBSTRING 함수 : 문자열을 잘라내 추출하는 것
	
	// TRIM 함수 : 문자열에서 앞뒤로 여분의 스페이스가 있을 때, 이를 제거해줌.
	
	// CHARACTER_LENGTH 함수 : 문자열의 길이를 계산해 돌려주는 함수임. VARCHAR은 가변 길이이므로 서로 다름.
	// OCTET_LENGTH 함수 : 문자열 길이를 바이트 단위로 계산하여 반환하는 함수
	
	//// 날짜 연산
	
	// CUREENT_TIMESTAMP : 시스템 날짜 확인
	
	
	// ORDER BY : 데이터 정렬 (기본값은 ASC임)
	this.orderBy = function(dataArr, column, type) {	// type : DESC or ASC
		var orderArr = [];
		
		// 가상의 코드 시작
		var data = [];	// 가상의 코드임.
		for (var i = 0; i < dataArr.length; i++) {
			if (dataArr[i][column] < dataArr[i+1][column]) {	// 임시로 이런 타입의 구조로 만들면 될 것 같음
				var temp = dataArr[i];		// 아니면 정렬 알고리즘을 참고하여 만든다.
				dataArr[i] = dataArr[i+1];	// 만약 행이 일정개수를 넘어가면, 다른 알고리즘을 사용하도록 한다.
				dataArr[i+1] = temp;		// 같은 수라면 복수 정렬을 감안하여 정리하지 않는다.
			}
		}
		// 가상의 코드 종료
		
		if (column) return column;
		
		// DESC냐 ASC냐에 따라 내림차순 또는 오름차순이 된다.
		
		// NULL이라면, 가장 나중으로 배치하도록 하거나 가장 먼저(0보다 앞서) 배치해야 할 수도 있다.
		// 이걸 정해야 한다.
		
		return orderArr;
	};
	
	// ORDER BY : 데이터 복수 정렬 (파라미터는 모두 배열임)
	this.orderAndOrderBy = function(dataArr, columns, types) {
		var resultArr = [];
		// 왼쪽 먼저 정렬 후 오른쪽 세부 정렬 방식을 채택한다.
		
		// 모든 column이 정렬될 때까지 반복
		for (var i = 0; i < columns.length; i++) {
			// 문제가 하나 있다.
			// a가 먼저 정렬되고 나서, b를 세부 정렬을 해야 하는데,
			// b가 a 하위 정렬 형태를 띄고 있다는 점이다.
			// 즉, a 정렬 완료하고 나면, 정렬 된 a 그룹 내 b를 정렬해야 한다는 것이다.
			// a값이 같은 원소가 3개 있다면, 같은 a 아이템 배열 3개 안에 b를 정렬해야 한다는 것이다.
		}
		return resultArr;
	}
	
	// 결과 행 제한하기 (최대 행수 제한 : 큰 규모의 이미지를 페이지 단위로 나누는 것과 비슷함)
	this.limit = function(num, offset) {	// offset의 값은 0부터임
		var dataArr = [];	// 이게 WHERE 검색 후 ORDER BY로 정렬된 결과 데이터 값 배열이다. (임시)
		
		// SELECT 열명 FROM 테이블명 WHERE 조건식 ORDER BY 열명 LIMIT 행수 [OFFSET 시작행]
		// 사실 얘는 표준이 아님
		
		// offset은 1페이지에서 2페이지로 넘어갈 때 2페이지부터 보여주기 위한 것과 같음.
		var resultArr = [];
		var startIndex = 0;
		
		if (offset) startIndex += offset;	// 오프셋이 지정 되있거나 0이 아닐 때
		
		for (var i = startIndex; i < (startIndex + num); i++) {
			var item = dataArr[i];
			resultArr.push(item);	// 아이템 배열의 오프셋과 제한 수에 따라 새로운 배열로 저장하여 반환한다.
		}
		
		return resultArr;
	}
	
	
	// BETWEEN a AND b : a 부터 b 까지의 모든 행을 잘라내 반환한다.
	this.between = function(a, b) {
		
	};
	
	//// 논리식
	// AND
	this.and = function(a, b) {
		return a && b;
	};
	
	// OR
	this.or = function(a, b) {
		return a || b;
	};
	
	// NOT
	this.not = function(item) {
		return !item;
	};
	
	//// 비교식
	
	// 참 애매한게, =는 WHERE a = 1을 원하는 경우거나 a = 1와 같은 경우인가를 묻는 것이라는 것이다.
	// WHERE a > 10이면 a가 10 이상인 값을 가진 데이터 배열을 반환하고,
	// 20 > 10이면 참을, 10 > 20이면 거짓을 반환하도록 하는 속성을 가진다.
	// 대체로 a가 데이터가 아니라면 반환할 값은 데이터 배열로, WHERE 기능을 하도록 한다.
	
	// = 연산자 : equivalence
	this.equal = function(a, b) {
		
	};
	
	// <> 연산자 : inequality
	this.notEqual = function(a, b) {
		
	};
	
	// > 연산자 : greatness
	this.prototyper = function(a, b) {
		
	};
	
	// >= 연산자 : Greater than or equal to
	this.prototyper = function(a, b) {
		
	};
	
	// < 연산자 : littleness
	this.prototyper = function(a, b) {
		
	};
	
	// <= 연산자 : Less than or equal to
	this.prototyper = function(a, b) {
		
	};
	
	
	//// 수치연산
	
	//// 사칙연산
	// 여기서 사칙연산은 계산 뿐만 아니라 SELECT에서 새로운 칼럼을 생성하기도 한다.
	
	// + 연산자 : 덧셈(가산)
	this.addition = function(a, b) {
		
	};
	
	// - 연산자 : 뺄셈(감산)
	this.subtraction = function(a, b) {
		
	};
	
	// * 연산자 : 곱셈(승산)
	this.multiplication = function(a, b) {
		
	};
	
	// / 연산자 : 나눗셈(제산)
	this.division = function(a, b) {
		
	};
	
	// % 연산자 : 나머지
	this.remainder = function(a, b) {
		
	};
	
	// ROUND 함수 : 반올림
	this.round = function(cols, units) {
		// 소수점 이하를 반올림
		// units는 몇단위로 반올림을 할 것인지를 지정.
		// units가 0이면 소수점 첫째자리에서, 2이면 셋째자리에서, 반대로 -2이면 10단위로, -4이면 천단위로 반올림한다.
	}
	// TRUNCATE 함수 : 버림
	this.truncate = function(cols, units) {
		// 버림
		// 여기 외에 나머지는 데이터베이스 매뉴얼을 참고해서 개발하도록 한다.
	}
	
};


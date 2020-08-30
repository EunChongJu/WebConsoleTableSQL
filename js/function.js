
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
	SQL의 명령어를 처리한 결과를 표시하는 것이다.
- data.js
	SQL의 명령어에 있어서
- function.js
	SQL의 명령어에 있어서 


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


var SQLProgram = function() {
	this.select = function(tableName) {
		return function(cols) {
			var colsArr = cols;
			return colsArr;
		};
	};
	
	this.where = function(gm) {
		if (gm) return;
	};
	
	this.insert = function(tableName) {
		return function(values) {
			var valArr = values;
			return valArr;
		};
	}
};

//1. 타입 시스템

let baseUrl = "https://mingo.team";

let nickname = Math.random() > 0.5 ? "밍고 크리에이터" : "등록된 닉네임이 없습니다.";

nickname.length;

//2. 할당 가능성
//3. 타입 애너테이션
let user; // 타입: any

user = "개발자 9Diin";
user.toUpperCase();

user = 1000;
user.toPrecision();
user.toUpperCase();
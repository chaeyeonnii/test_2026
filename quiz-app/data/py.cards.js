// 파이썬과학 암기카드 (문제은행과 별개). q=앞면, k=코드, a=뒷면 정답(단답), e=보충 설명
(window.CARDS = window.CARDS || {}).py = [
  // ── 16강 함수: **kwargs · import · __main__ ──
  {c:16,q:"**kwargs로 받은 인수는 어떤 자료형이 되는가?",a:"딕셔너리",e:"이름=값 인수들이 모인다 (키 = 인수 이름). 키워드 가변 인수."},
  {c:16,q:"*args로 받은 인수는 어떤 자료형이 되는가?",a:"튜플",e:"def fcnarg4(arg1, *arg2, **arg3) 순서."},
  {c:16,q:"딕셔너리 · 리스트 · 튜플의 괄호는?",a:"{ } · [ ] · ( )",e:"딕셔너리는 key:value (콜론)."},
  {c:16,q:"출력은?",k:`def fcnarg3(x, **kwargs):
    print(x, kwargs)

fcnarg3(0, first=1, second=2, third=3)`,a:"0 {'first': 1, 'second': 2, 'third': 3}",e:""},
  {c:16,q:"return이 없는 함수를 print(함수())로 부르면 마지막에 찍히는 값은?",a:"None",e:"오류가 아니다."},
  {c:16,q:"출력의 arg2 줄은?",k:`def fcnarg4(arg1, *arg2, **arg3):
    print("arg2 :", arg2)

fcnarg4(0, 2, 4, 8, t1=1, t2=3)`,a:"arg2 : (2, 4, 8)",e:"arg3 = {'t1': 1, 't2': 3}."},
  {c:16,q:"filename의 값은?",k:`date_info = {'year': "2020", 'month': "01", 'day': "01"}
filename = "{year}-{month}-{day}.txt".format(**date_info)`,a:"'2020-01-01.txt'",e:"**date_info가 이름=값으로 풀려 전달."},
  {c:16,q:"다른 .py 파일을 별칭으로 가져오는 구문의 빈칸은?",k:`import trapezium_def (   ) ta`,a:"as",e:"생략하면 trapezium_def.addition처럼 매번 전체 이름."},
  {c:16,q:"ta.addition(5,10) · ta.multiplication(5,10) · ta.divided_by_2(11)의 값은?",a:"15 · 50 · 5.5",e:""},
  {c:16,q:"‘이 프로그램이 직접 실행될 때’를 뜻하는 구문은?",a:"if __name__ == '__main__':",e:"import 당할 때는 실행되지 않음."},
  {c:16,q:"모듈을 import 할 때 불필요한 print가 실행되지 않게 하려면 어디에 넣는가?",a:"if __name__ == '__main__': 안",e:""},
  {c:16,q:"실행 코드를 묶어 맨 아래에서 호출하는 관례 함수 이름은?",a:"main()",e:"if __name__ == \"__main__\": main()"},
  {c:16,q:"밑변 20, 윗변 10, 높이 3인 사다리꼴 넓이는?",a:"45.0",e:"(밑변+윗변)/2×높이. input()은 float()로 변환."},

  // ── 17강 문자열 ──
  {c:17,q:"문자열은 어떤 자료형인가?",a:"시퀀스 자료형",e:"작은따옴표·큰따옴표로 표시. 인덱싱·슬라이싱 가능."},
  {c:17,q:"ASCII는 한 문자를 몇 bits로 저장하는가?",a:"7bits",e:"로마자가 아닌 문자는 표현 불가."},
  {c:17,q:"한·중·일 문자 표현에 쓰인 인코딩은?",a:"EUC (euc-kr 등)",e:"Extended Unix Code."},
  {c:17,q:"전세계 문자를 하나로 표현하는 인코딩은?",a:"UTF-8",e:"MS Windows는 CP949도 사용."},
  {c:17,q:"'Hello'의 음수 인덱스에서 'H'는?",a:"-5",e:"H=-5 e=-4 l=-3 l=-2 o=-1."},
  {c:17,q:"mystr0[2:4]의 값은? (mystr0 = '0123456789')",a:"'23'",e:"끝 인덱스 미포함."},
  {c:17,q:"mystr0[-1:-11:-1]의 값은?",a:"'9876543210'",e:"역순 전체."},
  {c:17,q:"'안녕하세요? 내 문자열입니다'[2:4]는?",a:"'하세'",e:"한글도 한 글자가 원소 하나."},
  {c:17,q:"문자열 연산자 + · * · in 의 역할은?",a:"연결 · 반복 · 포함 확인",e:"'Hello' * 3 = 'HelloHelloHello'."},
  {c:17,q:"줄바꿈 · 탭 · 역슬래시 이스케이프는?",a:"\\n · \\t · \\\\",e:"\\b backspace, \\\" 큰따옴표, \\' 작은따옴표."},
  {c:17,q:"\\xFF 형태 이스케이프의 뜻은?",a:"16진수 FF에 해당하는 문자",e:"\"\\x22\" = 큰따옴표."},
  {c:17,q:"문자열 길이를 구하는 함수는?",a:"len()",e:"upper() 대문자, lower() 소문자."},
  {c:17,q:"각 단어의 첫 글자를 대문자로 바꾸는 메서드는?",a:"title()",e:"'hello world'.title() = 'Hello World'."},
  {c:17,q:"문자열의 첫 문자만 대문자로 바꾸는 메서드는?",a:"capitalize()",e:"'hello world'.capitalize() = 'Hello world'."},
  {c:17,q:"'  hello'.capitalize()에서 h가 그대로인 이유는?",a:"첫 문자가 공백이라서",e:"나머지는 소문자로 바뀜."},
  {c:17,q:"양쪽 빈칸을 모두 지우는 메서드는?",a:"strip()",e:"lstrip() 왼쪽만, rstrip() 오른쪽만."},
  {c:17,q:"숫자인지 판정하는 메서드는?",a:"isdigit()",e:"islower() 소문자, isupper() 대문자."},
  {c:17,q:"sep 기준으로 문자열을 나눠 리스트로 만드는 메서드는?",a:"split(sep)",e:"생략하면 빈칸 기준."},
  {c:17,q:"'  a b'.split()과 split(' ')의 차이는?",a:"split(' ')은 빈 문자열('')이 생긴다",e:"split()은 연속 공백을 하나로 처리."},
  {c:17,q:"몇 번 있는지 세는 메서드는?",a:"count(str)",e:"find 왼쪽부터 처음 위치, rfind 오른쪽부터 처음 위치."},
  {c:17,q:"문자열이 str로 시작/끝나는지 확인하는 메서드는?",a:"startswith · endswith",e:"True/False 반환."}
];

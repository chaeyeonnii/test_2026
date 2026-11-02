// 파이썬과학 암기카드 (문제은행과 별개). q=앞면, k=코드, a=뒷면 정답, e=보충 설명
(window.CARDS = window.CARDS || {}).py = [
  // ── 16강 함수: **kwargs · import · __main__ ──
  {c:16,q:"함수 매개변수에 **가 붙으면(**kwargs) 호출할 때 준 인수는 어떤 형태로 전달되나요?",a:"이름=값 인수들이 딕셔너리로 모여 전달된다 (키 = 인수 이름)",e:"키워드 가변 인수(keyword variable length argument)."},
  {c:16,q:"*arg와 **kwarg로 받은 값의 자료형 차이는?",a:"*arg → 튜플 / **kwarg → 딕셔너리",e:"def fcnarg4(arg1, *arg2, **arg3) 순서."},
  {c:16,q:"딕셔너리·리스트·튜플을 만드는 괄호 기호는?",a:"딕셔너리 { } (key:value) · 리스트 [ ] · 튜플 ( )",e:"딕셔너리는 키와 값을 콜론(:)으로 대응시킨다."},
  {c:16,q:"이 코드의 첫 번째 출력 줄은?",k:`def fcnarg3(x, **kwargs):
    print(x, kwargs)

fcnarg3(0, first=1, second=2, third=3)`,a:"0 {'first': 1, 'second': 2, 'third': 3}",e:"x에는 0, 나머지 이름=값은 kwargs 딕셔너리."},
  {c:16,q:"print(fcnarg3(0, first=1, ...))를 하면 마지막에 None이 찍히는 이유는?",a:"함수에 return이 없어 반환값이 없기 때문 — 바깥 print가 None을 출력",e:"오류가 아니다."},
  {c:16,q:"이 코드의 출력은?",k:`def fcnarg4(arg1, *arg2, **arg3):
    print("arg1 :", arg1)
    print("arg2 :", arg2)
    print("arg3 :", arg3)

fcnarg4(0, 2, 4, 8, t1=1, t2=3, t3=4, name="johnson")`,a:"arg1 : 0\narg2 : (2, 4, 8)\narg3 : {'t1': 1, 't2': 3, 't3': 4, 'name': 'johnson'}",e:"위치 인수 나머지는 튜플, 이름=값은 딕셔너리."},
  {c:16,q:"이 코드로 만들어지는 filename은?",k:`date_info = {'year': "2020", 'month': "01", 'day': "01"}
filename = "{year}-{month}-{day}.txt".format(**date_info)`,a:"'2020-01-01.txt'",e:"**date_info가 year=, month=, day= 인수로 풀려 전달된다."},
  {c:16,q:"다른 .py 파일(trapezium_def.py)의 함수를 불러와 쓰는 명령과 별칭 붙이는 법은?",a:"import trapezium_def as ta → ta.addition(5, 10)",e:"as를 생략하면 trapezium_def.addition처럼 매번 전체 이름을 써야 한다."},
  {c:16,q:"import trapezium_def as ta 후 ta.addition(5,10) / ta.multiplication(5,10) / ta.divided_by_2(11)의 값은?",a:"15 / 50 / 5.5",e:"합, 곱, 2로 나누기 함수."},
  {c:16,q:"if __name__ == '__main__': 구문의 의미는?",a:"‘이 프로그램이 직접 실행될 때’ — import 당할 때는 실행되지 않는다",e:"import 시 필요 없는 계산·print를 이 안에 넣는다."},
  {c:16,q:"trapezium_area.py를 import 하면 15 50 25.0이 출력되지 않는 이유는?",a:"print 문이 if __name__ == '__main__': 안에 있어서, import 때는 실행되지 않기 때문",e:"직접 실행하면 15, 50, 25.0 출력."},
  {c:16,q:"실행 코드를 main() 함수로 묶는 관례를 쓰는 형태는?",k:`def main():
    ...

if __name__ == "__main__":
    main()`,a:"함수들을 정의한 뒤 맨 아래에서 __main__ 일 때만 main()을 호출",e:"import 해도 main()은 실행되지 않고 함수만 가져다 쓸 수 있다."},
  {c:16,q:"사다리꼴 넓이 프로그램 공식과 밑변 20·윗변 10·높이 3의 결과는?",k:`divided_by_2(addition(base_line, upper_edge)) * height`,a:"(밑변 + 윗변) ÷ 2 × 높이 = 45.0",e:"(20+10)/2*3 = 45.0, input()은 float()로 변환해 사용."},

  // ── 17강 문자열 ──
  {c:17,q:"문자열은 어떤 자료형(종류)이고, 어떻게 표시하나요?",a:"시퀀스 자료형 — 큰따옴표 또는 작은따옴표로 표시",e:"각 문자가 원소라 리스트처럼 인덱싱·슬라이싱 가능."},
  {c:17,q:"ASCII는 한 문자를 몇 bits로 저장하며 무엇을 표현하나요? 한계는?",a:"7bits — 영문자·숫자·특수문자 / 로마자가 아닌 문자는 표현 불가",e:"American Standard Code for Information Interchange."},
  {c:17,q:"한국·중국·일본 문자 표현에 쓰인 인코딩은?",a:"EUC (Extended Unix Code) — euc-kr, euc-cn, euc-jp",e:""},
  {c:17,q:"전세계 문자를 하나의 인코딩으로 쓰기 위해 나온 방식과 장점은?",a:"UTF-8 — 어느 문자의 인코딩인지 따로 설정할 필요가 없다",e:"슬라이드 표기: 최대 8bytes (실제 규격은 최대 4바이트). MS Windows는 CP949 사용, 개개의 파일은 UTF-8이 많다."},
  {c:17,q:"'Hello'의 양수 인덱스와 음수 인덱스는?",a:"H=0 e=1 l=2 l=3 o=4 / H=−5 e=−4 l=−3 l=−2 o=−1",e:"음수 인덱스는 뒤에서부터 −1."},
  {c:17,q:"출력은?",k:`mystr0 = '0123456789'
print(mystr0[0], mystr0[2:4], mystr0[9])
print(mystr0[-1:-11:-1])`,a:"0 23 9\n9876543210",e:"[2:4]는 끝 인덱스 미포함. [-1:-11:-1]은 역순 전체."},
  {c:17,q:"출력은? (한글도 한 글자가 원소 하나)",k:`mystr2 = '안녕하세요? 내 문자열입니다'
print(mystr2[0], mystr2[2:4], mystr2[9])`,a:"안 하세 문",e:"[0]='안', [2:4]='하세', [9]='문'."},
  {c:17,q:"문자열 연산자 +, *, in의 역할은?",a:"+ 합치기(연결) · * 반복 · in 특정 문자열이 있는지 확인",e:"'Hello' * 3 = 'HelloHelloHello'."},
  {c:17,q:"줄바꿈·탭·backspace·역슬래시 자체를 나타내는 이스케이프는?",a:"\\n · \\t · \\b · \\\\",e:"\\\" 큰따옴표, \\' 작은따옴표, \\f 새 페이지, \\r carriage return, \\v vertical tab."},
  {c:17,q:"\\xFF 형태의 이스케이프는 무엇을 나타내나요?",a:"16진수 FF(00~FF)에 해당하는 문자",e:"예: \"\\x22\" = 큰따옴표(\")."},
  {c:17,q:"len(str) / upper() / lower()의 기능은?",a:"길이 반환 / 대문자로 / 소문자로",e:""},
  {c:17,q:"title()과 capitalize()의 차이는?",a:"title() 각 단어의 첫 글자를 대문자로 / capitalize() 문자열의 첫 문자만 대문자로",e:"'hello world'.title() = 'Hello World', .capitalize() = 'Hello world'."},
  {c:17,q:"앞에 공백이 있는 문자열에 capitalize()를 하면?",k:`'  hello. This is my string '.capitalize()`,a:"'  hello. this is my string ' — 첫 문자가 공백이라 h는 그대로, 나머지는 소문자",e:"title()은 '  Hello. This Is My String '."},
  {c:17,q:"strip() / lstrip() / rstrip()의 차이는?",a:"strip 양쪽 빈칸 삭제 · lstrip 시작(왼쪽)만 · rstrip 끝(오른쪽)만",e:"mystr 길이 27 → strip 24, lstrip 25, rstrip 26."},
  {c:17,q:"islower() / isupper() / isdigit()의 기능은?",a:"소문자인지 / 대문자인지 / 숫자인지 판정 (True/False)",e:""},
  {c:17,q:"split(sep)의 기능과 sep를 생략했을 때는?",a:"sep 기준으로 문자열을 나눠 리스트로 만든다 / 생략하면 빈칸 기준",e:"'a,b,c'.split(',') = ['a','b','c']."},
  {c:17,q:"split()과 split(' ')의 결과 차이는?",k:`mystr = '  hello. This is my string '
mystr.split()
mystr.split(' ')`,a:"['hello.', 'This', 'is', 'my', 'string']\n['', '', 'hello.', 'This', 'is', 'my', 'string', '']",e:"split(' ')은 공백 하나하나로 자르므로 빈 문자열이 생긴다."},
  {c:17,q:"count(str) / find(str) / rfind(str)의 차이는?",a:"count 몇 번 있는지 · find 왼쪽부터 처음 위치 · rfind 오른쪽부터 처음 위치",e:"'  hello. This is my string ' → count('is')=2, find=11, rfind=14."},
  {c:17,q:"startswith(str)와 endswith(str)의 기능은?",a:"str로 문자열이 시작하는지 / 끝나는지 확인 (True/False)",e:""}
];

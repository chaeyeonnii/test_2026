// 데이터과학을 위한 파이썬(파이썬과학) 문제은행 (기말고사 범위)
// 출처: 파이썬16(함수 **kwargs·import·__main__), 파이썬17(문자열) 강의 PDF
BANK.push({
  id: "py",
  name: "파이썬과학",
  short: "파이썬",
  line: "4",
  chapters: {
    16: "함수: **kwargs · import · __main__",
    17: "문자열"
  },
  notes: {
    16: [
      "<b>**kwargs</b> (키워드 가변 인수): 호출 때 <b>이름=값</b>으로 준 인수가 <b>딕셔너리</b>로 모여 함수 안에서 쓰인다 (키 = 인수 이름)",
      "<b>*args</b>는 <b>튜플</b>, <b>**kwargs</b>는 <b>딕셔너리</b>. 함께 쓰면 순서는 (일반, *arg, **kwarg)",
      "딕셔너리 { } 의 key:value(콜론) · 리스트 [ ] · 튜플 ( )",
      "return이 없는 함수를 print(함수())로 부르면 함수 안 print 뒤에 <b>None</b>이 한 번 더 찍힘",
      "<code>\"{year}-{month}-{day}.txt\".format(**date_info)</code> → '2020-01-01.txt' (딕셔너리를 이름=값으로 풀어서 전달)",
      "<b>import 파일명 as 별칭</b>: 다른 .py의 함수 사용. as를 생략하면 매번 전체 이름(trapezium_def.addition)을 써야 함",
      "<b>if __name__ == '__main__':</b> = ‘이 프로그램이 직접 실행될 때’. import 당할 때는 실행되지 않음 → 불필요한 계산·print는 여기에 넣는다",
      "관례: 실행 코드를 main() 함수로 묶고 <code>if __name__ == \"__main__\": main()</code>",
      "사다리꼴 넓이 = (밑변 + 윗변) ÷ 2 × 높이 → 20, 10, 3이면 45.0"
    ],
    17: [
      "문자열 = <b>시퀀스 자료형</b>. ‘ ’ 또는 “ ” 로 표시. 각 문자가 원소라 리스트처럼 인덱싱·슬라이싱",
      "인덱스: 양수 0부터(H=0 … o=4), 음수 −1부터(o=−1 … H=−5)",
      "<b>ASCII</b> 7bits (영문·숫자·특수문자) → 비로마자는 표현 불가 → <b>EUC</b>(euc-kr·euc-cn·euc-jp) → 전세계 통합 <b>UTF-8</b> (인코딩 설정 불필요)",
      "MS Windows는 아직 <b>CP949</b> 인코딩, 개개의 파일은 UTF-8이 많음",
      "연산: <b>+</b> 연결 · <b>*</b> 반복 · <b>in</b> 포함 여부",
      "특수문자: \\\\ 역슬래시 · \\\" · \\' · <b>\\n</b> 줄바꿈 · <b>\\t</b> 탭 · <b>\\b</b> backspace · \\f 새 페이지 · \\r carriage return · \\v vertical tab · \\xFF 16진수 문자",
      "메서드: len · upper · lower · title(단어마다 첫글자 대문자) · capitalize(첫 문자만) · strip/lstrip/rstrip · islower/isupper · isdigit",
      "split(sep): sep 기준 분리 → 리스트 (sep 없으면 공백 기준, 연속 공백 무시 / split(' ')는 빈 문자열이 생김)",
      "count(s) 개수 · find(s) 왼쪽부터 위치 · rfind(s) 오른쪽부터 찾은 위치 · startswith · endswith",
      "예) '  hello. This is my string ' → len 27, strip 24, lstrip 25, rstrip 26, count('is')=2, find=11, rfind=14"
    ]
  },
  qs: [
    // ── 16강: 함수 인수 ──
    {t:"ox", c:16, q:"함수 매개변수 앞에 **를 붙이면 호출할 때 준 `이름=값` 인수들이 튜플로 모인다.", a:"X", e:"**kwargs는 딕셔너리, *args가 튜플이다.", src:"강의"},
    {t:"ox", c:16, q:"**kwargs로 받은 인수는 함수 안에서 딕셔너리로 쓰이며, 키는 호출할 때 쓴 인수 이름이다.", a:"O", e:"fcnarg3(0, first=1) → kwargs = {'first': 1}", src:"강의", s:1},
    {t:"ox", c:16, q:"파이썬에서 딕셔너리는 { }, 리스트는 [ ], 튜플은 ( )로 만든다.", a:"O", e:"딕셔너리는 key:value를 콜론으로 대응시킨다.", src:"강의"},
    {t:"ox", c:16, q:"return 문이 없는 함수를 `print(함수())`로 호출하면 오류가 난다.", a:"X", e:"오류가 아니라 None이 출력된다. 반환값이 없으면 None이다.", src:"강의", s:1},
    {t:"ox", c:16, q:"한 함수에서 `*arg`와 `**kwarg`를 함께 매개변수로 쓸 수 있다.", a:"O", e:"def fcnarg4(arg1, *arg2, **arg3) 형태.", src:"강의"},
    {t:"mc", c:16, q:"다음 코드를 실행했을 때 `arg3`에 담기는 값은?", k:`def fcnarg4(arg1, *arg2, **arg3):
    print("arg1 :", arg1)
    print("arg2 :", arg2)
    print("arg3 :", arg3)

fcnarg4(0, 2, 4, 8, t1=1, t2=3, t3=4, name="johnson")`, o:["{'t1': 1, 't2': 3, 't3': 4, 'name': 'johnson'}","(2, 4, 8)","[0, 2, 4, 8]","{'arg1': 0}"], a:0, e:"arg1=0, arg2=(2, 4, 8) 튜플, arg3=이름=값 인수들의 딕셔너리.", src:"강의", s:1},
    {t:"mc", c:16, q:"위 코드에서 `arg2`를 출력한 결과는?", k:`def fcnarg4(arg1, *arg2, **arg3):
    print("arg2 :", arg2)

fcnarg4(0, 2, 4, 8, t1=1, t2=3, t3=4, name="johnson")`, o:["arg2 : [2, 4, 8]","arg2 : {2, 4, 8}","arg2 : (2, 4, 8)","arg2 : 2"], a:2, e:"*가 붙은 매개변수는 위치 인수 나머지를 튜플로 받는다.", src:"강의"},
    {t:"mc", c:16, q:"다음 코드의 맨 마지막 줄에 출력되는 것은?", k:`def fcnarg3(x, **kwargs):
    print(x, kwargs)

print(fcnarg3(0, first=1, second=2, third=3))`, o:["3","0","오류 발생","None"], a:3, e:"함수 안 print가 `0 {...}`을 찍고, return이 없어 바깥 print가 None을 찍는다.", src:"강의", s:1},
    {t:"mc", c:16, q:"다음 코드의 실행 결과는?", k:`date_info = {'year': "2020", 'month': "01", 'day': "01"}
filename = "{year}-{month}-{day}.txt".format(**date_info)
print(filename)`, o:["2020-01-01.txt","{year}-{month}-{day}.txt","year-month-day.txt","오류 발생"], a:0, e:"**date_info가 year=..., month=..., day=...로 풀려 format에 전달된다.", src:"강의"},
    {t:"mc", c:16, q:"다른 파이썬 파일(trapezium_def.py)의 함수를 불러올 때 올바른 명령은?", o:["include trapezium_def","load trapezium_def.py","from ta import trapezium_def","import trapezium_def as ta"], a:3, e:"import 파일명 as 별칭 → ta.addition(5,10)처럼 사용.", src:"강의"},
    {t:"mc", c:16, q:"`if __name__ == '__main__':` 구문의 의미로 가장 알맞은 것은?", o:["이 프로그램이 직접 실행될 때","프로그램이 오류 없이 끝났을 때","다른 프로그램이 import 했을 때","main 함수를 삭제할 때"], a:0, e:"직접 실행될 때만 아래 블록이 실행되고, import 당할 때는 실행되지 않는다.", src:"강의", s:1},
    {t:"mc", c:16, q:"trapezium_area.py를 `import trapezium_area as ta` 로 불러왔을 때 일어나는 일은?", k:`# trapezium_area.py
def addition(x, y):
    return x + y

if __name__ == '__main__':
    print(addition(10, 5))`, o:["15가 바로 출력된다","NameError가 발생한다","프로그램이 종료된다","아무것도 출력되지 않고 ta.addition()을 쓸 수 있다"], a:3, e:"__main__ 블록은 import 때 실행되지 않는다.", src:"강의", s:1},
    {t:"mc", c:16, q:"`import trapezium_def` 처럼 as 없이 불러오면 함수를 어떻게 호출해야 하는가?", o:["addition(5,10)","ta.addition(5,10)","trapezium_def.addition(5,10)","import.addition(5,10)"], a:2, e:"as 별칭이 없으면 매번 모듈 전체 이름을 써야 해서 as를 자주 쓴다.", src:"강의"},
    {t:"mc", c:16, q:"사다리꼴 넓이 프로그램에서 밑변 20, 윗변 10, 높이 3을 입력했을 때 출력되는 넓이는?", o:["30.0","45.0","90.0","60.0"], a:1, e:"(20 + 10) ÷ 2 × 3 = 45.0", src:"강의"},
    {t:"sa", c:16, q:"함수 호출에서 `이름=값` 형태로 준 인수들을 딕셔너리로 받는 매개변수 표기는? (예: `def f(x, ___)`)", a:"**kwargs", al:["**kwarg","**"], e:"키워드 가변 인수.", src:"강의"},
    {t:"sa", c:16, q:"`print(fcnarg3(0, first=1))` 에서 함수 출력 끝에 None이 찍히는 이유를 쓰시오.", a:"함수에 return 문이 없어 반환값이 없기 때문 (바깥 print가 None을 출력)", e:"반환값 없는 함수의 결과는 None.", src:"강의", s:1},
    {t:"sa", c:16, q:"다음 코드의 출력은?", k:`def f(a, *b, **c):
    print(a, b, c)

f(1, 2, x=3)`, a:"1 (2,) {'x': 3}", e:"a=1, b=(2,) 튜플, c={'x': 3} 딕셔너리.", src:"강의"},
    {t:"sa", c:16, q:"다른 프로그램이 import 할 때 실행되면 안 되는 계산·출력은 어떤 구문 안에 넣는가?", a:"if __name__ == '__main__':", al:["if __name__ == \"__main__\":","__name__ == '__main__'"], e:"직접 실행될 때만 동작.", src:"강의", s:1},
    {t:"bl", c:16, q:"함수의 매개변수에서 *가 하나 붙으면 (①)로, **가 두 개 붙으면 (②)로 전달 인수가 모인다.", a:"① 튜플 ② 딕셔너리", e:"*arg2 → (2, 4, 8), **arg3 → {'t1': 1, ...}", src:"강의", s:1},
    {t:"bl", c:16, q:"파이썬에서 리스트는 (①), 튜플은 (②), 딕셔너리는 (③) 기호로 값을 둘러싼다.", a:"① [ ] ② ( ) ③ { }", e:"딕셔너리는 key:value를 콜론(:)으로 대응.", src:"강의"},
    {t:"bl", c:16, q:"다른 파이썬 파일을 불러오는 명령은 (①)이고, 긴 이름 대신 짧은 이름을 붙이려면 (②) 뒤에 별칭을 쓴다.", a:"① import ② as", e:"import trapezium_def as ta", src:"강의"},

    // ── 17강: 문자열 ──
    {t:"ox", c:17, q:"파이썬의 문자열은 시퀀스 자료형이라 리스트처럼 인덱싱과 슬라이싱을 할 수 있다.", a:"O", e:"'Hello'[0] = 'H', 'Hello'[-1] = 'o'", src:"강의"},
    {t:"ox", c:17, q:"ASCII는 한 문자를 저장하는 데 7bits를 사용하며 한글을 표현할 수 있다.", a:"X", e:"ASCII는 영문·숫자·특수문자만 가능. 비로마자는 표현할 수 없어 EUC, UTF-8 등이 필요.", src:"강의", s:1},
    {t:"ox", c:17, q:"UTF-8은 어떤 문자의 인코딩인지 따로 설정할 필요가 없도록 만든 전세계 문자 공통 인코딩이다.", a:"O", e:"euc-kr, euc-jp처럼 나라별로 지정하지 않아도 된다.", src:"강의"},
    {t:"ox", c:17, q:"MS Windows는 기본적으로 CP949 인코딩을 사용한다.", a:"O", e:"다만 개개의 파일은 UTF-8을 쓰는 경우가 많다.", src:"강의"},
    {t:"ox", c:17, q:"`'  hello. This is my string '.capitalize()`는 앞의 공백을 무시하고 h를 H로 바꾼다.", a:"X", e:"capitalize()는 문자열의 첫 문자만 대문자로 바꾸는데, 첫 문자가 공백이라 변화가 없다.", src:"강의", s:1},
    {t:"ox", c:17, q:"`split()`과 `split(' ')`은 항상 같은 결과를 돌려준다.", a:"X", e:"앞뒤·연속 공백이 있으면 split(' ')은 빈 문자열('')이 리스트에 생긴다.", src:"강의", s:1},
    {t:"ox", c:17, q:"`'abc' * 3`은 'abcabcabc'이다.", a:"O", e:"* 는 문자열 반복.", src:"강의"},
    {t:"mc", c:17, q:"다음 코드의 출력 결과는?", k:`mystr0 = '0123456789'
print(mystr0[0], mystr0[2:4], mystr0[9])`, o:["0 234 9","0 23 9","1 23 9","0 23 10"], a:1, e:"[2:4]는 인덱스 2, 3 → '23'. 끝 인덱스는 포함하지 않는다.", src:"강의", s:1},
    {t:"mc", c:17, q:"다음 코드의 출력 결과는?", k:`mystr0 = '0123456789'
print(mystr0[-1:-11:-1])`, o:["0123456789","9876543210","987654321","9"], a:1, e:"-1부터 -10까지 한 칸씩 뒤로 가므로 역순 전체.", src:"강의", s:1},
    {t:"mc", c:17, q:"다음 코드의 출력 결과는?", k:`mystr1 = 'Hello. This is my string'
print(mystr1[0], mystr1[2:4], mystr1[9])`, o:["H el i","H ll h","H ll i","e ll i"], a:2, e:"[0]='H', [2:4]='ll', [9]='i' (Hello.=0~5, 공백=6, T=7, h=8, i=9)", src:"강의"},
    {t:"mc", c:17, q:"`'안녕하세요? 내 문자열입니다'`에 대해 `s[0], s[2:4]`의 결과는?", o:["안 하세","안 녕하","녕 하세","안 하"], a:0, e:"한글도 한 글자가 원소 하나. [2:4]는 3번째~4번째 글자 '하세'.", src:"강의"},
    {t:"mc", c:17, q:"문자열 'Hello'에서 음수 인덱스 -4가 가리키는 문자는?", o:["H","l","o","e"], a:3, e:"-5=H, -4=e, -3=l, -2=l, -1=o", src:"강의"},
    {t:"mc", c:17, q:"`print('Hello' * 2 + '!')`의 출력은?", o:["Hello2!","Hello!Hello!","HelloHello!","오류 발생"], a:2, e:"* 가 + 보다 먼저 계산된다.", src:"강의"},
    {t:"mc", c:17, q:"탭(tab)을 나타내는 이스케이프 문자는?", o:["\\n","\\t","\\b","\\r"], a:1, e:"\\n 줄바꿈, \\t 탭, \\b backspace, \\r carriage return.", src:"강의"},
    {t:"mc", c:17, q:"각 단어의 첫 글자를 대문자로 바꾸는 문자열 메서드는?", o:["capitalize()","upper()","strip()","title()"], a:3, e:"capitalize()는 문자열 첫 문자 하나만 대문자로 바꾼다.", src:"강의", s:1},
    {t:"mc", c:17, q:"`mystr = '  hello. This is my string '` (앞 공백 2칸, 뒤 공백 1칸)일 때 `len(mystr)`는?", o:["24","27","25","26"], a:1, e:"strip()한 길이 24 + 앞 2칸 + 뒤 1칸 = 27", src:"강의"},
    {t:"mc", c:17, q:"같은 문자열에서 `len(mystr.lstrip())`의 값은?", k:`mystr = '  hello. This is my string '`, o:["24","25","26","27"], a:1, e:"lstrip은 앞(왼쪽) 공백 2칸만 지운다 → 27 − 2 = 25.", src:"강의"},
    {t:"mc", c:17, q:"같은 문자열에서 `mystr.count('is')`, `mystr.find('is')`, `mystr.rfind('is')`의 값은?", k:`mystr = '  hello. This is my string '`, o:["2, 14, 11","3, 11, 14","2, 11, 14","2, 12, 15"], a:2, e:"'This'의 is와 단독 'is' 두 번 → count 2. 왼쪽에서 처음 11, 오른쪽에서 처음 14.", src:"강의", s:1},
    {t:"mc", c:17, q:"`mystr.split()`의 결과로 알맞은 것은?", k:`mystr = '  hello. This is my string '`, o:["['hello.', 'This', 'is', 'my', 'string']","['', '', 'hello.', 'This', 'is', 'my', 'string', '']","['hello.This is my string']","['h','e','l','l','o']"], a:0, e:"인수가 없으면 공백(연속 공백 포함)을 기준으로 나누고 빈 문자열은 만들지 않는다.", src:"강의", s:1},
    {t:"mc", c:17, q:"`mystr.split(' ')`의 결과로 알맞은 것은?", k:`mystr = '  hello. This is my string '`, o:["['', '', 'hello.', 'This', 'is', 'my', 'string', '']","['hello.', 'This', 'is', 'my', 'string']","['  hello.', 'This is my string ']","오류 발생"], a:0, e:"공백 하나하나로 자르기 때문에 앞 공백 2칸과 뒤 공백 1칸에서 빈 문자열이 생긴다.", src:"강의", s:1},
    {t:"mc", c:17, q:"문자열 `s`가 'He'로 시작하는지 확인하는 메서드는?", o:["s.find('He')","s.endswith('He')","s.startswith('He')","s.count('He')"], a:2, e:"startswith 시작, endswith 끝 확인 (True/False).", src:"강의"},
    {t:"sa", c:17, q:"문자열의 시작과 끝 부분의 빈칸을 모두 지우는 메서드는?", a:"strip()", al:["strip"], e:"lstrip() 왼쪽만, rstrip() 오른쪽만.", src:"강의"},
    {t:"sa", c:17, q:"문자열에서 특정 문자열이 몇 번 나오는지 세는 메서드는?", a:"count()", al:["count","count(str)"], e:"find는 위치, count는 횟수.", src:"강의"},
    {t:"sa", c:17, q:"문자열을 ',' 기준으로 나누어 리스트로 만드는 코드를 쓰시오. (문자열 변수명 s)", a:"s.split(',')", al:["s.split(\",\")"], e:"split(sep)", src:"강의"},
    {t:"sa", c:17, q:"`'banana'.find('an')`, `'banana'.rfind('an')`의 값을 순서대로 쓰시오.", a:"1, 3", e:"왼쪽부터 처음 위치 1, 오른쪽부터 처음 위치 3.", src:"추가"},
    {t:"sa", c:17, q:"다음 코드의 출력은?", k:`s = 'abc'
print(s * 2 + 'd', 'bc' in s)`, a:"abcabcd True", e:"* 반복 → 'abcabc' + 'd', in은 포함 여부.", src:"추가"},
    {t:"sa", c:17, q:"ASCII, EUC 이후 전세계 문자를 하나의 인코딩으로 표현하기 위해 등장한 인코딩 방식 이름은?", a:"UTF-8", al:["utf-8","UTF8","utf8","유니코드"], e:"Unicode Transformation Format-8.", src:"강의"},
    {t:"bl", c:17, q:"문자열 'Hello'에서 H의 양수 인덱스는 (①), 음수 인덱스는 (②)이다.", a:"① 0 ② -5", e:"o는 양수 4, 음수 -1.", src:"강의"},
    {t:"bl", c:17, q:"문자열 연산에서 연결은 (①), 반복은 (②), 포함 여부 확인은 (③)이다.", a:"① + ② * ③ in", e:"print('Hello' * 3), 'He' in mystr1", src:"강의"},
    {t:"bl", c:17, q:"줄바꿈은 (①), 탭은 (②), 한 칸 지우기(backspace)는 (③)로 쓴다.", a:"① \\n ② \\t ③ \\b", e:"\\\\ 는 역슬래시 자체.", src:"강의"},
    {t:"bl", c:17, q:"ASCII는 한 문자에 (①) bits를 쓰고, 한국·중국·일본 문자는 (②)로, 전세계 문자는 (③)로 표현한다.", a:"① 7 ② EUC ③ UTF-8", e:"MS Windows는 CP949 사용.", src:"강의", s:1}
  ]
});

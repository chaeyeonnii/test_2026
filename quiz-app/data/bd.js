// 빅데이터개론 문제은행 (기말고사 범위)
// 출처: bigd_07_chart (주가 데이터 파이프라인 제작 7장 — 그래프가 사진으로 온다)
BANK.push({
  id: "bd",
  name: "빅데이터개론",
  chapters: {
    7: "그래프가 사진으로 온다 (차트 전송)"
  },
  notes: {
    7: [
      "<b>파이프라인</b>: 수집 → 저장 → 가공 → 시각화 → 확인. 13장 중 7장 = 그래프가 사진으로 온다 (5장 pandas·matplotlib, 6장 관심종목 전부, 8장 종가 DB)",
      "결과물: 종목마다 <b>오늘 하루 흐름 그래프</b>가 텔레그램 사진으로 도착. 그래프는 <b>파일로 저장하지 않고 메모리에서 바로 전송</b>, 가격·등락 두 줄은 메시지 → <b>사진 캡션</b>으로 이동. 이번 장에서 새로 배우는 것은 그리는 법이 아니라 <b>보내는 법</b>",
      "새 함수: fetch_naver_intraday_minutes()(오늘 분봉 조회) · build_price_chart()(그래프 이미지 생성) · send_telegram_photo()(이미지 전송) · describe_price_trend()(그래프 설명 문구) · dedupe_daily_closes(), _evenly_spaced()(보조)",
      "ZIP: 이번 장부터 <b>watchlist.example.csv</b>만 포함 (내 watchlist.csv가 덮어써지지 않게). 파일이 없으면 example을 복사해 이름 변경. .env도 .env.example만 포함",
      "<b>sendMessage</b>(글자) vs <b>sendPhoto</b>(사진+캡션): 차이는 <b>files=</b> 하나뿐. 캡션은 짧게(<b>1024자</b>), 종목마다 한 장씩",
      "<b>send_telegram_photo(photo_buffer: io.BytesIO, caption: str) -> bool</b>: url(sendPhoto 주소) · files = {\"photo\": (\"chart.png\", photo_buffer, \"image/png\")} (파일이름, 내용, MIME) · data = chat_id, caption, parse_mode=\"HTML\"",
      "requests.post(url, data=data, files=files, <b>timeout=15</b>) → <b>status_code == 200</b>이면 True. try/except Exception as e로 오류가 나도 프로그램이 멈추지 않고 False 반환",
      "<b>io.BytesIO</b>: 메모리 안의 가상 이진 파일(file-like object). read·write·seek·tell·getvalue 제공. 디스크에 파일을 만들지 않음",
      "캡션: parse_mode=\"HTML\"이라 &lt;b&gt;가 굵은 글씨, <b>html.escape()</b>는 종목명 특수문자로 태그 구조가 깨지는 것 방지",
      "분봉은 종목마다 미리 한 번에 모아 둠: <code>{code: fetch…(code) for code in current_prices}</code>. <code>next(iter(딕셔너리))</code>로 첫 키 하나만 꺼내 추이 문구를 대표 종목 한 번만 붙임",
      "<b>build_price_chart(daily_closes, current_price=None, intraday_minutes=None) -> io.BytesIO</b>. 뒤의 둘은 기본값 None이라 생략 가능. matplotlib.use(\"Agg\") = 화면 없이 이미지(버퍼)로만 저장",
      "버퍼 반환 5줄: <b>io.BytesIO() → fig.savefig(buffer, format=\"png\") → plt.close(fig) → buffer.seek(0) → return buffer</b>. seek(0)이 없으면 커서가 맨 끝이라 0바이트를 읽어 전송 실패 (가장 쉬운 실수), close는 fig가 쌓이는 것 방지",
      "오늘 구간 데이터 우선순위: <b>분봉 &gt; 현재가 한 점 &gt; 없음(빈 리스트)</b>. 과거 종가는 점+값 라벨(ax.annotate, f\"{yi:,}\" 천단위 콤마), 오늘 분봉은 선, 마지막 점만 빨간 점",
      "plt.subplots() → fig(그림 전체)와 ax(좌표축). 그리기는 ax, 저장은 fig. x축은 <b>왼쪽 절반(과거) 0~0.5 / 오른쪽 절반(오늘) 0.5~1.0</b>으로 강제 분할 (점 개수가 15개 vs 수백 개라 그냥 이으면 과거가 왼쪽에 뭉침)",
      "<b>_evenly_spaced(start, end, n)</b>: n ≤ 0 → [], n == 1 → [start], 그 외 step = (end−start)/(n−1)로 n개의 균등 좌표. start=0, end=1, n=5 → [0, 0.25, 0.5, 0.75, 1]",
      "x축 눈금: 분봉은 하루 300~400개 → <b>정각(HH:00)만</b> 표시(\"0900\" → 슬라이싱 [:2], [2:]로 \"09:00\"), 라벨 45도 기울임. zip(today_x, intraday_minutes)로 좌표와 분봉을 묶어 순회",
      "<b>dedupe_daily_closes</b>: 오늘 날짜(KST, '20260815' 형식) 항목을 과거 목록에서 빼 장마감 뒤 같은 값이 두 번 찍히는 것 방지. <b>이번 장은 첫 인자가 []라 하는 일이 없음</b> (9장부터)",
      "<b>describe_price_trend</b> 문구 3가지: 과거 종가 있음 → ‘최근 N일 종가 + 현재가 추이’(9장부터) / 분봉만 → ‘오늘 현재가 추이(종가 히스토리 누적 전)’(이번 장) / 둘 다 없음 → ‘현재가(종가 히스토리 누적 전)’(장 시작 전). daily_closes를 먼저 확인해야 ‘최근 0일’이 안 나옴",
      "<b>그래프 왼쪽이 비어 있는 것은 정상</b>: 과거 종가를 아직 저장하지 않았기 때문 (daily_x가 빈 리스트라 if 블록이 건너뛰어짐 — 빈 리스트는 거짓). 8장에서 DB에 쌓아 채움. 단 9장 이후에 이 문구가 보이면 DB를 못 읽은 것",
      "실행: 종목 3개 → 텍스트 1통 + 사진 3장. 🎉 줄이 종목 수만큼 나오면 정상. 일부 종목만 ❌여도 실패가 아니며 <b>하나도 못 보냈을 때만 실패</b>",
      "분봉 API는 표준 JSON이 아님 (EUC-KR·깨진 문자가 섞임) → response.json()이 안 먹혀 <b>re.findall()</b>로 숫자 데이터 행(12자리 시각, 가격)만 뽑음. 응답이 최신순이라 <b>reverse()</b>로 시간 오름차순. 실패 시 빈 리스트 반환",
      "params 딕셔너리는 requests가 <code>?symbol=005930&amp;…</code>로 바꿔 URL 뒤에 붙임 (<b>?</b> 쿼리 시작, <b>키=값</b>, <b>&amp;</b> 파라미터 구분). 이 API는 그때그때 계산해 주므로 저장할 필요 없음",
      "한글 폰트: 환경에 실제 설치된 것(Malgun Gothic·NanumGothic·AppleGothic)만 걸러 지정 — 안 걸러면 findfont 경고가 수백 줄. 하나도 없으면 sans-serif로 떨어져 한글이 네모(□)로 깨짐",
      "자주 막히는 곳: 점이 하나뿐(7·8장에서는 정상) · 장 시작 전이면 현재가 한 점 · 한글이 □ → 폰트 없음 · <b>사진은 안 오고 텍스트만 → 캡션이 너무 길거나 buffer.seek(0)이 빠짐</b>"
    ]
  },
  qs: [
    // ── 큰 그림 ──
    {t:"ox", c:7, q:"7장에서 새로 배우는 핵심은 그래프를 그리는 방법이 아니라 그래프를 보내는 방법이다.", a:"O", e:"그리는 법은 5장(plt.subplots → ax.plot → ax.annotate → fig.savefig)에서 배웠다.", src:"강의"},
    {t:"ox", c:7, q:"7장의 그래프는 PNG 파일로 디스크에 저장한 뒤 그 파일을 텔레그램으로 전송한다.", a:"X", e:"파일로 저장하지 않고 io.BytesIO 버퍼(메모리)에서 바로 전송한다.", src:"강의", s:1},
    {t:"ox", c:7, q:"7장부터 종목의 가격·등락 정보는 메시지 본문이 아니라 사진 캡션으로 옮겨 간다.", a:"O", e:"텍스트 메시지에는 헤더와 추이 설명만 남는다.", src:"강의"},
    {t:"ox", c:7, q:"7장 ZIP에는 내가 고친 watchlist.csv가 덮어써지지 않도록 watchlist.example.csv만 들어 있다.", a:"O", e:"watchlist.csv가 없다면 example을 복사해 이름을 바꾼다. .env도 .env.example만 들어 있다.", src:"강의"},
    {t:"mc", c:7, q:"주가 데이터 파이프라인의 단계 순서로 올바른 것은?", o:["저장 → 수집 → 가공 → 시각화 → 확인","수집 → 저장 → 가공 → 시각화 → 확인","수집 → 가공 → 저장 → 확인 → 시각화","시각화 → 수집 → 저장 → 가공 → 확인"], a:1, e:"수집 → 저장 → 가공 → 시각화 → 확인", src:"강의"},
    {t:"mc", c:7, q:"7장에 새로 생기는 함수가 아닌 것은?", o:["send_telegram_message()","fetch_naver_intraday_minutes()","build_price_chart()","send_telegram_photo()"], a:0, e:"sendMessage 함수는 3장부터 쓰던 기존 함수다. 새 함수는 분봉 조회·차트 생성·사진 전송·추이 문구·보조 함수들.", src:"강의"},
    {t:"mc", c:7, q:"13장 중 7장 다음에 올 8장의 주제는?", o:["종가를 DB에 쌓기","관심종목 전부 받기","그래프 그리기","텔레그램 봇 만들기"], a:0, e:"7장의 빈 왼쪽 그래프를 채울 종가를 DB에 쌓기 시작한다.", src:"강의"},

    // ── sendPhoto ──
    {t:"ox", c:7, q:"sendMessage와 sendPhoto의 코드 차이는 requests.post에 files= 인수가 있는지 하나뿐이다.", a:"O", e:"나머지는 지금까지 쓰던 방식 그대로다.", src:"강의", s:1},
    {t:"ox", c:7, q:"sendPhoto의 캡션은 글자 수 제한이 넉넉해 아무리 길어도 된다.", a:"X", e:"캡션은 짧게(1024자) 써야 한다. 글자 수 제한이 넉넉한 쪽은 sendMessage.", src:"강의", s:1},
    {t:"ox", c:7, q:"files={\"photo\": (\"chart.png\", ...)} 의 \"chart.png\"는 디스크에 실제로 존재하는 파일 이름이다.", a:"X", e:"실제 파일이 아니라 텔레그램에 알려주는 이름일 뿐이다.", src:"강의", s:1},
    {t:"ox", c:7, q:"send_telegram_photo()는 요청 중 어떤 예외가 발생해도 프로그램을 멈추지 않고 False를 반환한다.", a:"O", e:"try/except Exception as e 로 막고 print 후 return False.", src:"강의"},
    {t:"ox", c:7, q:"requests.post(..., timeout=15)는 15초 이상 응답이 없으면 요청을 중단해 프로그램이 멈추는 것을 막는다.", a:"O", e:"", src:"강의"},
    {t:"mc", c:7, q:"sendMessage와 비교한 sendPhoto의 특징으로 옳은 것은?", o:["보낼 것이 텍스트 한 덩어리다","캡션 제한이 없다","files= 인수가 추가되고 종목마다 한 장씩 보낸다","이미지를 디스크 파일로만 보낼 수 있다"], a:2, e:"sendPhoto: 이미지 파일 + 설명글(캡션 1024자), 종목마다 한 장.", src:"강의"},
    {t:"mc", c:7, q:"send_telegram_photo()의 시그니처에서 `-> bool`이 뜻하는 것은?", k:`def send_telegram_photo(photo_buffer: io.BytesIO, caption: str) -> bool:`, o:["사진을 bool 타입으로 변환한다","caption이 참일 때만 실행한다","함수가 오류를 발생시킨다","전송 성공 여부를 True/False로 반환한다는 타입 힌트"], a:3, e:"photo_buffer는 메모리 이미지, caption은 설명 텍스트.", src:"강의"},
    {t:"mc", c:7, q:"`files = {\"photo\": (\"chart.png\", photo_buffer, \"image/png\")}`에서 튜플의 세 값은 순서대로 무엇인가?", o:["(파일 이름, 파일 내용, MIME 타입)","(파일 내용, 파일 이름, MIME 타입)","(MIME 타입, 파일 이름, 파일 내용)","(URL, 파일 이름, 파일 내용)"], a:0, e:"멀티파트 업로드 형식 — (파일이름, 파일내용, MIME 타입).", src:"강의", s:1},
    {t:"mc", c:7, q:"send_telegram_photo()의 data 딕셔너리에 들어가는 키가 아닌 것은?", k:`data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption, "parse_mode": "HTML"}`, o:["chat_id","caption","photo","parse_mode"], a:2, e:"photo는 files에 들어간다. data는 수신 방, 캡션, 캡션 서식(HTML).", src:"강의"},
    {t:"mc", c:7, q:"`return response.status_code == 200`의 의미는?", o:["항상 True를 반환","응답 본문이 200자일 때 True","HTTP 200(정상)일 때만 True를 반환","200번 재시도한다"], a:2, e:"그 외 코드면 False.", src:"강의"},
    {t:"mc", c:7, q:"`except Exception as e:` 에서 `as e`의 역할은?", o:["발생한 예외 객체를 e에 담아 원인을 확인할 수 있게 한다","예외를 무시한다","예외를 다시 발생시킨다","e라는 함수를 만든다"], a:0, e:"print(f\"... {e}\")처럼 원인을 출력한다.", src:"강의"},
    {t:"mc", c:7, q:"io.BytesIO에 대한 설명으로 옳은 것은?", o:["디스크에 저장된 이진 파일 경로","텔레그램 봇 토큰 형식","JSON 파싱 함수","메모리 안에 존재하는 가상의 이진 파일 (file-like object)"], a:3, e:"read(), write(), seek(), tell(), getvalue() 등 일반 파일과 같은 인터페이스를 제공한다.", src:"강의", s:1},
    {t:"mc", c:7, q:"사진 캡션에서 `<b>종목명</b>`이 굵은 글씨로 보이는 이유는?", o:["html.escape()를 호출해서","matplotlib이 렌더링해서","parse_mode=\"HTML\"로 캡션을 HTML로 해석하기 때문","텔레그램이 모든 <b>를 굵게 처리해서"], a:2, e:"html.escape()는 종목명에 특수문자가 있어도 태그 구조가 깨지지 않게 해 준다.", src:"강의"},
    {t:"mc", c:7, q:"`html.escape(info['name'])`을 쓰는 이유는?", o:["종목명을 영어로 번역하려고","글자를 굵게 만들려고","종목명에 섞인 특수문자 때문에 태그 구조가 깨지지 않도록","캡션 길이를 줄이려고"], a:2, e:"HTML 모드에서 <, >, & 같은 문자가 태그로 오해되는 것을 막는다.", src:"강의"},

    // ── send_price_notification ──
    {t:"mc", c:7, q:"다음 코드가 만드는 intraday_by_code의 형태는?", k:`intraday_by_code = {code: fetch_naver_intraday_minutes(code)
                    for code in current_prices}`, o:["{종목 코드: 오늘 분봉 데이터} 딕셔너리","종목 코드 리스트","분봉 데이터의 합계","종목 이름 집합"], a:0, e:"current_prices를 for로 돌면 키(종목 코드)가 나온다. 분봉을 종목마다 미리 한 번에 모아 둔다.", src:"강의", s:1},
    {t:"mc", c:7, q:"`first_code = next(iter(current_prices))`가 가져오는 것은?", o:["가장 큰 가격","딕셔너리 전체 복사본","딕셔너리의 첫 번째 키(종목 코드) 하나","마지막 값"], a:2, e:"추이 문구는 종목마다 거의 같아 대표 종목 한 개만 써서 한 번만 붙인다.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 호출에서 두 번째 인자 `info[\"price\"]`는 build_price_chart()의 어떤 매개변수에 전달되는가?", k:`for code, info in current_prices.items():
    intraday_minutes = intraday_by_code[code]
    chart_buffer = build_price_chart([], info["price"], intraday_minutes)`, o:["daily_closes","current_price","intraday_minutes","chart_buffer"], a:1, e:"[]은 daily_closes(과거 종가 목록, 아직 없음), info[\"price\"]는 current_price(오늘 값 하나), 세 번째가 intraday_minutes.", src:"강의", s:1},
    {t:"mc", c:7, q:"위 호출에서 첫 번째 인자 `[]`의 의미는?", k:`build_price_chart([], info["price"], intraday_minutes)`, o:["분봉이 없다","과거 종가 목록이 비어 있다 (아직 저장 안 함)","현재가가 0이다","종목이 없다"], a:1, e:"daily_closes에 빈 리스트를 넘긴다.", src:"강의"},
    {t:"mc", c:7, q:"`for code, info in current_prices.items():` 에서 `info`는 무엇인가?", o:["종목 코드","가격 관련 정보 객체(딕셔너리)","분봉 리스트","차트 버퍼"], a:1, e:"items()는 (키, 값) 쌍을 하나씩 순회한다. 키 code, 값 info.", src:"강의"},

    // ── build_price_chart ──
    {t:"ox", c:7, q:"build_price_chart()에서 intraday_minutes와 current_price는 = None 기본값이 있어 생략할 수 있다.", a:"O", e:"과거 종가(daily_closes)만 넘겨도 함수는 돌아간다.", src:"강의"},
    {t:"ox", c:7, q:"matplotlib.use(\"Agg\")는 화면 없이 이미지(버퍼)로만 저장하겠다는 설정이다.", a:"O", e:"서버·봇처럼 GUI가 없는 환경에서 쓴다.", src:"강의"},
    {t:"ox", c:7, q:"fig.savefig(buffer) 직후에는 buffer.seek(0)을 하지 않아도 읽는 쪽이 처음부터 정상적으로 읽는다.", a:"X", e:"savefig 직후 커서는 맨 끝에 있어 그대로 넘기면 0바이트를 읽어 전송이 실패한다. seek(0) 필수.", src:"강의", s:1},
    {t:"ox", c:7, q:"plt.close(fig)를 호출하지 않으면 함수를 반복 호출할 때 fig가 계속 메모리에 쌓인다.", a:"O", e:"다 쓴 fig를 닫아 메모리를 회수한다.", src:"강의"},
    {t:"ox", c:7, q:"분봉 데이터가 없고 현재가만 있으면 오늘 구간에는 점이 하나만 찍힌다.", a:"O", e:"장 시작 전·주말 상황. 분봉 > 현재가 한 점 > 없음 순으로 우선순위.", src:"강의"},
    {t:"ox", c:7, q:"matplotlib에서 그리기는 fig에, 저장은 ax에 한다.", a:"X", e:"반대다. 그리기는 ax(좌표축), 저장은 fig(그림 전체).", src:"강의", s:1},
    {t:"mc", c:7, q:"build_price_chart()가 이미지를 버퍼로 돌려줄 때 올바른 순서는?", o:["buffer = io.BytesIO() → plt.close → savefig → seek(0) → return","buffer = io.BytesIO() → fig.savefig(buffer, format=\"png\") → plt.close(fig) → buffer.seek(0) → return buffer","fig.savefig → buffer.seek(0) → io.BytesIO() → return","io.BytesIO() → return buffer → savefig"], a:1, e:"이 순서의 마지막 다섯 줄이 핵심이다.", src:"강의", s:1},
    {t:"mc", c:7, q:"build_price_chart()가 오늘 구간에 그릴 데이터를 고르는 우선순위는?", k:`if intraday_minutes:
    today_prices = [m["price"] for m in intraday_minutes]
elif current_price is not None:
    today_prices = [current_price]
else:
    today_prices = []`, o:["분봉 > 현재가 한 점 > 없음","현재가 한 점 > 분봉 > 없음","없음 > 분봉 > 현재가","항상 분봉만 사용"], a:0, e:"조회 실패(둘 다 없음)여도 프로그램은 멈추지 않고 과거 종가만 그린다.", src:"강의", s:1},
    {t:"mc", c:7, q:"그래프에서 과거 종가와 오늘 분봉을 각각 어떻게 표시하는가?", o:["과거: 점 + 값 라벨 / 오늘: 선","과거: 선 / 오늘: 점+라벨","둘 다 점","둘 다 선"], a:0, e:"마지막 지점 하나만 빨간 점으로 강조한다.", src:"강의"},
    {t:"mc", c:7, q:"x축을 왼쪽 절반(과거)·오른쪽 절반(오늘)으로 강제로 나눠 배치하는 이유는?", o:["색을 구분하려고","한글을 표시하려고","용량을 줄이려고","점 개수가 과거 15개 vs 분봉 수백 개라 그냥 이으면 과거가 왼쪽 끝에 뭉치기 때문"], a:3, e:"_evenly_spaced(0.0, 0.5, ...)와 _evenly_spaced(0.5, 1.0, ...)를 사용한다.", src:"강의", s:1},
    {t:"mc", c:7, q:"`ax.annotate(f\"{yi:,}\", ..., xytext=(0, 8), ...)` 에서 `{yi:,}`와 `xytext=(0, 8)`의 의미는?", o:["소수점 둘째 자리 / 점 아래로 8포인트","천 단위 콤마 (71500 → 71,500) / 점 기준 위로 8포인트 띄움","16진수 변환 / 오른쪽으로 8포인트","문자열 정렬 / 글자 크기 8"], a:1, e:"라벨을 점 위에 겹치지 않게 띄운다.", src:"강의"},
    {t:"mc", c:7, q:"분봉이 하루 300~400개일 때 x축 눈금을 정각(HH:00)만 표시하는 이유는?", o:["정각 데이터만 존재해서","전부 표시하면 겹쳐서 읽을 수 없기 때문 (6~7개로 줄어 읽을 수 있음)","API가 정각만 돌려줘서","색을 줄이려고"], a:1, e:"“데이터가 많다”가 곧 “보기 좋다”는 아니다. 골라 보여주는 것도 설계다.", src:"강의"},
    {t:"mc", c:7, q:"`m[\"time\"]`이 \"0900\"일 때 눈금 라벨을 \"09:00\"으로 만드는 식은?", k:`tick_labels.append(f"{m['time'][:2]}:{m['time'][2:]}")`, o:["split(':')","슬라이싱 [:2]와 [2:]를 이용해 앞 두 자리와 나머지를 콜론으로 이음","replace('0', ':')","int(m['time']) / 100"], a:1, e:"[:2] = '09', [2:] = '00'. 라벨은 45도 기울여 겹침을 한 번 더 피한다.", src:"강의"},
    {t:"mc", c:7, q:"`zip(today_x, intraday_minutes)`가 하는 일은?", o:["두 리스트를 하나로 압축 파일로 만든다","두 리스트를 정렬한다","두 리스트의 합집합을 만든다","X 좌표 리스트와 분봉 딕셔너리 리스트를 묶어 동시에 하나씩 꺼낸다"], a:3, e:"for xi, m in zip(today_x, intraday_minutes): 형태.", src:"강의"},
    {t:"mc", c:7, q:"한글 폰트를 이렇게 고르는 이유는?", k:`installed_fonts = {f.name for f in font_manager.fontManager.ttflist}
korean_fonts = [name for name in ("Malgun Gothic", "NanumGothic", "AppleGothic")
                if name in installed_fonts]
plt.rcParams["font.family"] = korean_fonts or ["sans-serif"]`, o:["폰트 용량을 줄이려고","영문 폰트를 우선하려고","폰트를 새로 설치하려고","환경에 실제 설치된 것만 걸러 넘겨 findfont 경고가 수백 줄 쏟아지는 것을 막으려고"], a:3, e:"맥은 애플고딕, 윈도우는 맑은고딕, 리눅스는 한글 폰트가 없을 수도 있다. 하나도 없으면 sans-serif로 떨어져 한글이 □로 깨진다.", src:"강의"},

    // ── _evenly_spaced / dedupe / describe ──
    {t:"mc", c:7, q:"`_evenly_spaced(0, 1, 5)`의 반환값은?", k:`def _evenly_spaced(start: float, end: float, n: int) -> list:
    if n <= 0:
        return []
    if n == 1:
        return [start]
    step = (end - start) / (n - 1)
    return [start + step * i for i in range(n)]`, o:["[0, 0.25, 0.5, 0.75, 1]","[0, 0.2, 0.4, 0.6, 0.8]","[0.25, 0.5, 0.75, 1]","[0, 1, 2, 3, 4]"], a:0, e:"step = (1−0)/(5−1) = 0.25.", src:"강의", s:1},
    {t:"mc", c:7, q:"`_evenly_spaced(0.0, 0.5, 0)`처럼 n이 0 이하일 때 반환값은?", o:["[]","[0.0]","None","오류 발생"], a:0, e:"이번 장의 과거 종가가 정확히 이 경우(점 0개)다. n == 1이면 [start].", src:"강의", s:1},
    {t:"mc", c:7, q:"`_evenly_spaced(0.5, 1.0, 1)`의 반환값은?", o:["[]","[0.5]","[1.0]","[0.5, 1.0]"], a:1, e:"점이 딱 1개면 간격을 나눌 수 없으므로 시작값만 담긴 리스트를 반환한다.", src:"강의"},
    {t:"mc", c:7, q:"dedupe_daily_closes()가 하는 일은?", k:`today_str = datetime.now(KST).strftime("%Y%m%d")
return [e for e in daily_closes if e["date"] != today_str]`, o:["일별 종가를 모두 삭제한다","오늘 종가를 추가한다","오늘 날짜와 같은 항목을 과거 종가 목록에서 빼서 오늘 점이 두 번 찍히지 않게 한다","날짜를 문자열로 바꿔 출력한다"], a:2, e:"장마감 뒤엔 DB의 마지막 종가와 ‘오늘’ 점이 같은 값으로 두 번 찍히기 때문. 이번 장은 첫 인자가 []라 걸러낼 것이 없다(9장부터 일함).", src:"강의", s:1},
    {t:"ox", c:7, q:"7장에서 dedupe_daily_closes()는 아무 일도 하지 않지만, 9장부터 실제로 쓰이기 때문에 미리 읽어 둔다.", a:"O", e:"daily_closes가 [] 라 걸러낼 항목이 없다.", src:"강의"},
    {t:"mc", c:7, q:"describe_price_trend()에서 daily_closes를 분봉(intraday_minutes)보다 먼저 확인하는 이유는?", o:["성능 때문에","분봉을 먼저 보면 히스토리가 0일 때 ‘최근 0일 종가’ 같은 이상한 문구가 나오기 때문","분봉이 더 중요해서","오류를 방지하려고"], a:1, e:"“최근 N일”이라고 말하려면 N을 세어줄 종가가 먼저 있어야 한다. 순서를 바꾸면 문구가 깨진다.", src:"강의", s:1},
    {t:"mc", c:7, q:"7장에서 폰으로 오는 추이 문구(정상)는?", o:["최근 N일 종가 + 현재가 추이","현재가(종가 히스토리 누적 전)","오류: DB를 읽지 못했습니다","오늘 현재가 추이(종가 히스토리 누적 전)"], a:3, e:"첫 줄은 9장부터, 세 번째 줄은 주식장 시작 전.", src:"강의", s:1},
    {t:"mc", c:7, q:"가진 데이터와 describe_price_trend()가 돌려주는 문구의 올바른 짝은?", o:["과거 종가 있음 → ‘현재가(종가 히스토리 누적 전)’","둘 다 없음 → ‘최근 N일 종가 + 현재가 추이’","과거 종가 있음 → ‘오늘 현재가 추이’","분봉만 있음 → ‘오늘 현재가 추이(종가 히스토리 누적 전)’"], a:3, e:"과거 종가 있음 → ‘최근 N일 종가 + 현재가 추이’, 둘 다 없음 → ‘현재가(종가 히스토리 누적 전)’.", src:"강의"},

    // ── 미완성 결과물 / 실행 ──
    {t:"ox", c:7, q:"7장 실행 결과에서 그래프 왼쪽 절반이 비어 있으면 코드에 오류가 있는 것이다.", a:"X", e:"정상이다. 아직 과거 종가를 어디에도 저장하지 않았기 때문이다. “채울 자리가 남은 그래프”.", src:"강의", s:1},
    {t:"ox", c:7, q:"9장 이후에도 “오늘 현재가 추이(종가 히스토리 누적 전)” 문구가 보이면 정상이다.", a:"X", e:"9장 이후에 이 문구가 보이면 DB를 못 읽은 것이다. 화면은 같아도 장에 따라 뜻이 정반대다.", src:"강의", s:1},
    {t:"ox", c:7, q:"왼쪽이 빈 그래프는 새 종목을 관심종목에 추가했을 때 실제 운영에서도 똑같이 나타나는 정상 상태이다.", a:"O", e:"며칠 지나 종가가 쌓이면 하루에 한 칸씩 채워진다.", src:"강의"},
    {t:"ox", c:7, q:"왼쪽이 비어 있는 이유는 daily_x가 빈 리스트라 `if daily_x:` 블록이 통째로 건너뛰어지기 때문이다.", a:"O", e:"빈 리스트는 거짓으로 평가된다. 에러가 아니라 정상 동작.", src:"강의", s:1},
    {t:"mc", c:7, q:"종목이 3개일 때 7장 실행 시 폰으로 오는 것은?", o:["텍스트 1통 + 사진 3장","텍스트 3통","사진 1장","텍스트 1통"], a:0, e:"종목이 셋이면 사진도 셋, 캡션도 셋이다.", src:"강의", s:1},
    {t:"mc", c:7, q:"실행 로그에서 어떤 경우를 ‘실패’로 보는가?", o:["한 종목이라도 ❌가 나온 경우","종목 수보다 🎉가 적을 때","하나도 보내지 못했을 때만","캡션이 길 때"], a:2, e:"일부 종목의 사진만 실패해도 나머지는 정상 도착하므로 실패로 보지 않는다.", src:"강의"},
    {t:"mc", c:7, q:"사진은 오지 않고 텍스트만 오는 경우 의심할 원인은?", o:["watchlist.csv가 너무 많아서","한글 폰트가 많아서","봇 토큰이 공개되어서","캡션이 너무 길거나 buffer.seek(0)이 빠졌을 수 있다"], a:3, e:"캡션 1024자 제한 초과 또는 seek(0) 누락(0바이트 전송).", src:"강의", s:1},
    {t:"mc", c:7, q:"그래프의 한글이 네모(□)로 깨지는 경우의 원인은?", o:["API 응답이 EUC-KR이라서","savefig 형식이 png라서","한글 폰트가 설치되지 않은 환경(sans-serif로 떨어짐)","timeout이 짧아서"], a:2, e:"맥·윈도우는 기본 폰트가 있어 대개 괜찮다. 리눅스에서는 나눔고딕을 설치한다.", src:"강의"},
    {t:"mc", c:7, q:"장 시작 전이나 주말에 그래프를 만들면 어떤 모양이 되는가?", o:["빈 그래프","에러로 종료","분봉이 없어 현재가 한 점만 찍힌다","과거 종가만 그려진다"], a:2, e:"장중(9:00~15:30)에 다시 실행하면 분봉 선이 그려진다.", src:"강의"},

    // ── 분봉 API ──
    {t:"ox", c:7, q:"당일 분봉 API는 표준 JSON이라 response.json() 한 줄로 딕셔너리가 된다.", a:"X", e:"EUC-KR 인코딩과 깨진 문자가 섞인 비표준 응답이라 response.json()이 그대로 먹히지 않는다. (현재가 API는 json() 가능)", src:"강의", s:1},
    {t:"ox", c:7, q:"분봉 API의 응답은 최신순이라 reverse()로 뒤집어 시간 오름차순 리스트로 만든다.", a:"O", e:"fetch 결과는 [{\"time\": \"0900\", \"price\": 71000}, …, {\"time\": \"1530\", ...}] 형태.", src:"강의"},
    {t:"ox", c:7, q:"분봉 조회가 실패하거나 장이 열리지 않았을 때 fetch_naver_intraday_minutes()는 빈 리스트를 반환하며, 그래도 그래프는 그려진다.", a:"O", e:"실패해도 빈 리스트 — 프로그램은 계속 간다.", src:"강의"},
    {t:"ox", c:7, q:"분봉 API는 저장해 둔 데이터를 돌려주므로 우리가 따로 저장하지 않으면 사라진다.", a:"X", e:"그때그때 다시 계산해서 돌려주므로 우리가 저장할 필요가 없다.", src:"강의"},
    {t:"mc", c:7, q:"분봉 응답에서 필요한 행만 뽑기 위해 사용한 기법은?", o:["response.json()","pandas.read_csv()","BeautifulSoup","정규식 re.findall()"], a:3, e:"12자리 시각과 가격 숫자만 괄호로 감싸 뽑는다. 헤더의 한글 라벨은 깨지지만 숫자 데이터 행은 멀쩡하다.", src:"강의", s:1},
    {t:"mc", c:7, q:"requests.get에 params 딕셔너리를 넘기면 URL에 어떻게 붙는가?", k:`params = {"symbol": code, "requestType": 1, "startTime": date_str,
          "endTime": date_str, "timeframe": "minute"}`, o:["?symbol=005930&requestType=1&… 쿼리 문자열로 붙는다","URL 경로에 /로 붙는다","JSON 본문으로 전송된다","헤더에 붙는다"], a:0, e:"? 쿼리 문자열의 시작, 키=값, & 파라미터 사이의 구분자.", src:"강의", s:1},
    {t:"mc", c:7, q:"fetch_naver_intraday_minutes()의 반환 형태로 올바른 것은?", o:["[71000, 70900, …]","{\"005930\": 71000}","문자열 하나","[{\"time\": \"0900\", \"price\": 71000}, …] (시각 오름차순)"], a:3, e:"하루 300~400개. 그래프를 그리는 쪽은 이 모양만 알면 된다.", src:"강의"},
    {t:"sa", c:7, q:"io.BytesIO로 만든 메모리 이미지를 requests로 전송하기 직전에 반드시 해야 하는 호출은?", a:"buffer.seek(0)", al:["seek(0)","buffer.seek(0)"], e:"savefig 직후 커서가 맨 끝이라 되돌리지 않으면 0바이트를 읽는다.", src:"강의", s:1},
    {t:"sa", c:7, q:"텔레그램에서 이미지와 캡션을 함께 보내는 봇 API 이름은?", a:"sendPhoto", al:["send_photo"], e:"글자만 보내는 것은 sendMessage.", src:"강의"},
    {t:"sa", c:7, q:"sendPhoto 캡션의 글자 수 제한은 몇 자인가?", a:"1024자", al:["1024"], e:"캡션은 짧게 써야 한다.", src:"강의"},
    {t:"sa", c:7, q:"그래프 왼쪽이 비어 있는 것이 정상인 이유를 한 문장으로 쓰시오.", a:"아직 과거 종가를 어디에도 저장하지 않아서 오늘 분봉만 그려지기 때문", e:"8장에서 DB에 종가를 쌓아 채운다.", src:"강의", s:1},
    {t:"sa", c:7, q:"파일을 디스크에 만들지 않고 메모리에서 바로 이미지를 다루기 위해 쓴 클래스는?", a:"io.BytesIO", al:["BytesIO"], e:"메모리 안의 가상 이진 파일.", src:"강의"},
    {t:"bl", c:7, q:"send_telegram_photo()는 (①)로 주소를, (②)로 이미지를, (③)로 chat_id·caption·parse_mode를 준비한다.", a:"① url ② files ③ data", e:"어디로(url), 무엇을(files), 어떤 옵션으로(data).", src:"강의"},
    {t:"bl", c:7, q:"build_price_chart()는 이미지를 (①)에 저장한 뒤 (②)(0)으로 커서를 처음으로 되돌리고 (③)를 반환한다.", a:"① 버퍼(io.BytesIO) ② seek ③ buffer", e:"fig.savefig(buffer, format=\"png\") 후 plt.close(fig).", src:"강의"},
    {t:"bl", c:7, q:"오늘 구간 데이터는 우선순위가 (①) > (②) > 없음 이다.", a:"① 분봉 ② 현재가 한 점", e:"intraday_minutes → [current_price] → [].", src:"강의"},
    {t:"bl", c:7, q:"그래프의 x축은 왼쪽 절반 (①)~0.5에 과거 종가를, 오른쪽 절반 0.5~(②)에 오늘 분봉을 배치한다.", a:"① 0.0 ② 1.0", e:"_evenly_spaced로 균등 간격 배치.", src:"강의"},
    {t:"bl", c:7, q:"describe_price_trend()는 과거 종가가 있으면 ‘최근 (①)일 종가 + 현재가 추이’, 분봉만 있으면 ‘오늘 현재가 추이(종가 (②) 누적 전)’을 돌려준다.", a:"① N ② 히스토리", e:"둘 다 없으면 ‘현재가(종가 히스토리 누적 전)’.", src:"강의"}
  ]
});

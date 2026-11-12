// 빅데이터개론 문제은행 (기말고사 범위)
// 출처: bigd_07_chart · bigd_08_db · bigd_09_module (주가 데이터 파이프라인 제작)
BANK.push({
  id: "bd",
  name: "빅데이터개론",
  chapters: {
    7: "그래프가 사진으로 온다 (차트 전송)",
    8: "종가가 DB에 쌓인다 (Turso · SQL)",
    9: "그래프 왼쪽이 채워진다 (모듈화)"
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
    // ══ 7장 그래프가 사진으로 온다 ══
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`def send_telegram_photo(photo_buffer: io.BytesIO, caption: str) -> bool:`, o:["메모리의 이미지와 캡션을 텔레그램으로 보내고 성공 여부(True/False)를 돌려준다","이미지를 파일로 저장한다","캡션을 bool로 바꾼다","사진을 다운로드한다"], a:0, e:"-> bool은 반환 타입 힌트(전송 성공 여부).", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`files = {"photo": ("chart.png", photo_buffer, "image/png")}`, o:["메모리 버퍼를 chart.png라는 이름의 PNG 이미지로 전송 준비한다","chart.png 파일을 디스크에서 읽는다","이미지를 삭제한다","PNG를 JPG로 변환한다"], a:0, e:"튜플은 (파일이름, 파일내용, MIME 타입). 이름은 텔레그램에 알려주는 이름일 뿐.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드에서 timeout=15의 역할은?", k:`response = requests.post(url, data=data, files=files, timeout=15)
return response.status_code == 200`, o:["15초 넘게 응답이 없으면 요청을 중단하고, HTTP 200이면 True를 돌려준다","15번 재시도한다","15장까지 전송한다","15바이트만 전송한다"], a:0, e:"예외는 except에서 False 처리.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption, "parse_mode": "HTML"}`, o:["수신 방, 캡션, 캡션 서식(HTML 태그 허용)을 지정한다","사진을 지정한다","토큰을 지정한다","URL을 지정한다"], a:0, e:"photo는 data가 아니라 files에 들어간다.", src:"강의"},
    {t:"sa", c:7, q:"다음 코드의 결과(intraday_by_code)는 어떤 자료형인가?", k:`intraday_by_code = {code: fetch_naver_intraday_minutes(code)
                    for code in current_prices}`, a:"딕셔너리", al:["dict","딕셔너리 {종목코드: 분봉}"], e:"{종목 코드: 오늘 분봉}. 딕셔너리를 for로 돌면 키가 나온다.", src:"강의", s:1},
    {t:"sa", c:7, q:"다음 코드가 꺼내는 값은?", k:`first_code = next(iter(current_prices))`, a:"맨 처음 키(종목코드)", al:["첫 번째 종목코드","첫 종목 코드","첫 번째 키"], e:"대표 종목 하나로 추이 문구를 한 번만 붙이기 위해.", src:"강의"},
    {t:"mc", c:7, q:"다음 코드에서 빈 리스트 [] 자리가 나타내는 것은?", k:`for code, info in current_prices.items():
    chart_buffer = build_price_chart([], info["price"], intraday_minutes)`, o:["과거 종가 목록(7장은 아직 없음)","오늘 분봉","종목 코드","캡션"], a:0, e:"첫 인자 daily_closes. 그래서 왼쪽이 빈 그래프.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드의 마지막 두 줄이 하는 일은?", k:`buffer = io.BytesIO()
fig.savefig(buffer, format="png")
plt.close(fig)
buffer.seek(0)
return buffer`, o:["그래프를 메모리 버퍼에 PNG로 저장하고 커서를 맨 앞으로 돌려 반환한다","그래프를 파일로 저장한다","그래프를 삭제한다","버퍼를 비운다"], a:0, e:"seek(0)이 없으면 0바이트를 읽어 전송 실패. plt.close(fig)는 메모리 회수.", src:"강의", s:1},
    {t:"sa", c:7, q:"위 코드에서 buffer.seek(0)을 빼면 일어나는 일은?", k:`buffer = io.BytesIO()
fig.savefig(buffer, format="png")
return buffer`, a:"0바이트를 읽어 전송 실패", al:["빈 이미지","전송 실패","사진이 안 간다","커서가 끝에 있어 읽을 데이터가 없다"], e:"savefig 직후 커서가 맨 끝이다.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`if intraday_minutes:
    today_prices = [m["price"] for m in intraday_minutes]
elif current_price is not None:
    today_prices = [current_price]
else:
    today_prices = []`, o:["오늘 구간에 그릴 가격을 분봉 > 현재가 한 점 > 없음 순으로 고른다","분봉을 삭제한다","현재가를 0으로 만든다","과거 종가를 만든다"], a:0, e:"어떤 경우에도 프로그램은 멈추지 않는다.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드의 출력 결과는?", k:`yi = 71500
print(f"{yi:,}")`, o:["71,500","71500","71.500","7,1500"], a:0, e:"천 단위 콤마 서식.", src:"강의"},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`ax.annotate(f"{yi:,}", (xi, yi), textcoords="offset points",
            xytext=(0, 8), ha="center", fontsize=13)`, o:["점 위 8포인트 자리에 천 단위 콤마가 붙은 값 라벨을 가운데 정렬로 단다","점을 삭제한다","y축 눈금을 만든다","그래프 제목을 만든다"], a:0, e:"", src:"강의"},
    {t:"sa", c:7, q:"다음 코드가 강조하는 것은?", k:`if today_prices:
    ax.plot(x[-1], prices[-1], marker="o", color="#d62728")`, a:"마지막 지점(현재가)을 빨간 점으로", al:["현재가","마지막 점","현재가 빨간 점"], e:"과거 종가는 파란 점(#1f77b4).", src:"강의"},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`for xi, m in zip(today_x, intraday_minutes):
    if m["time"].endswith("00"):
        tick_positions.append(xi)
        tick_labels.append(f"{m['time'][:2]}:{m['time'][2:]}")`, o:["정각(HH:00)인 분봉만 골라 09:00 형태의 x축 눈금으로 만든다","모든 분봉을 눈금으로 만든다","분봉을 삭제한다","시간을 초로 바꾼다"], a:0, e:"분봉이 300~400개라 전부 표시하면 겹친다.", src:"강의", s:1},
    {t:"mc", c:7, q:"_evenly_spaced(0.0, 1.0, 5)의 반환값은?", k:`def _evenly_spaced(start, end, n):
    if n <= 0: return []
    if n == 1: return [start]
    step = (end - start) / (n - 1)
    return [start + step * i for i in range(n)]`, o:["[0.0, 0.25, 0.5, 0.75, 1.0]","[0.0, 0.2, 0.4, 0.6, 0.8]","[0, 1, 2, 3, 4]","[1.0]"], a:0, e:"구간을 n개 점으로 균등하게 나눈다.", src:"강의", s:1},
    {t:"sa", c:7, q:"7장에서 이 코드의 결과는? (daily_prices가 빈 리스트)", k:`daily_x = _evenly_spaced(0.0, 0.5, len(daily_prices))`, a:"[]", al:["빈 리스트","빈리스트"], e:"n ≤ 0 → []. 그래서 왼쪽 절반이 빈다.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`today_str = datetime.now(KST).strftime("%Y%m%d")
return [e for e in daily_closes if e["date"] != today_str]`, o:["오늘 날짜 항목을 과거 목록에서 빼 같은 값이 두 번 찍히는 것을 막는다","오늘 날짜만 남긴다","날짜를 정렬한다","DB에 저장한다"], a:0, e:"7장은 daily_closes가 []라 아무 일도 안 한다.", src:"강의", s:1},
    {t:"mc", c:7, q:"7장에서 분봉만 있을 때 이 함수가 돌려주는 문구는?", k:`if daily_closes:
    return f"최근 {len(daily_closes)}일 종가 + 현재가 추이"
if intraday_minutes:
    return "오늘 현재가 추이(종가 히스토리 누적 전)"
return "현재가(종가 히스토리 누적 전)"`, o:["오늘 현재가 추이(종가 히스토리 누적 전)","최근 0일 종가 + 현재가 추이","현재가(종가 히스토리 누적 전)","빈 문자열"], a:0, e:"daily_closes를 먼저 확인해 ‘최근 0일’이 나오지 않게 한다.", src:"강의", s:1},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`minutes = [{"time": ts[8:], "price": int(p)} for ts, p in rows]
minutes.reverse()`, o:["시각에서 시:분만 떼어 price와 묶고, 최신순 응답을 시간 오름차순으로 뒤집는다","가격을 문자열로 바꾼다","분봉을 삭제한다","rows를 정렬한다"], a:0, e:"결과 [{\"time\":\"0900\",\"price\":71000}, …].", src:"강의", s:1},
    {t:"sa", c:7, q:"다음 params가 URL에 붙을 때 ? 와 & 의 역할은?", k:`params = {"symbol": code, "requestType": 1, "startTime": date_str}`, a:"? 쿼리 시작, & 파라미터 구분", al:["?는 시작 &는 구분","쿼리 시작과 구분자"], e:"?symbol=005930&requestType=1&startTime=…", src:"강의"},
    {t:"mc", c:7, q:"다음 코드가 하는 일은?", k:`korean_fonts = [name for name in ("Malgun Gothic", "NanumGothic", "AppleGothic")
                if name in installed_fonts]
plt.rcParams["font.family"] = korean_fonts or ["sans-serif"]`, o:["설치된 한글 폰트만 골라 지정하고, 하나도 없으면 sans-serif로 둔다","세 폰트를 모두 설치한다","폰트를 삭제한다","폰트 크기를 바꾼다"], a:0, e:"없는 이름을 나열하면 findfont 경고가 수백 줄. sans-serif면 한글이 □로 깨진다.", src:"강의", s:1},
    {t:"mc", c:7, q:"fetch_naver_intraday_minutes 안의 이 코드가 하는 일은?", k:`except Exception as e:
    print(f"분봉 조회 실패: {e}")
    return []`, o:["오류가 나도 빈 리스트를 돌려 프로그램이 계속 가게 한다","프로그램을 종료한다","재시도한다","오류를 숨기고 None을 반환한다"], a:0, e:"그래프는 과거 종가 또는 현재가로 계속 그려진다.", src:"강의"},
    {t:"sa", c:7, q:"requests.post에서 sendMessage와 sendPhoto의 코드 차이는?", k:`requests.post(url, data=data)
requests.post(url, data=data, files=files)`, a:"files= 인자", al:["files","files=","files 하나"], e:"차이는 files= 하나뿐.", src:"강의"},
    {t:"mc", c:7, q:"다음 코드에서 html.escape()를 쓰는 이유는?", k:`caption = f"<b>{html.escape(name)}</b> {price:,}원"`, o:["종목명에 특수문자가 있어도 HTML 태그 구조가 깨지지 않게 하려고","글자를 굵게 하려고","글자를 지우려고","한글을 영어로 바꾸려고"], a:0, e:"굵게 되는 것은 parse_mode=\"HTML\" + <b> 태그 덕분.", src:"강의"},

    // ══ 8장 종가가 DB에 쌓인다 ══
    {t:"mc", c:8, q:"다음 코드가 하는 일은?", k:`client.execute(
    "CREATE TABLE IF NOT EXISTS price_history ("
    "code TEXT NOT NULL, date TEXT NOT NULL, close INTEGER NOT NULL, "
    "PRIMARY KEY (code, date))"
)`, o:["표가 없으면 (종목코드, 날짜)를 기본키로 하는 종가 표를 만들고, 있으면 그대로 둔다","표를 지우고 새로 만든다","종가를 조회한다","표에 행을 추가한다"], a:0, e:"몇 번 실행해도 안전. PRIMARY KEY (code, date) = 같은 종목·날짜는 한 줄.", src:"강의", s:1},
    {t:"mc", c:8, q:"다음 코드가 하는 일은?", k:`url = TURSO_DATABASE_URL.replace("libsql://", "https://", 1)`, o:["WebSocket이 막힌 네트워크에서 무한 대기하지 않도록 접속 주소를 https로 바꾼다","토큰을 숨긴다","DB를 삭제한다","주소를 암호화한다"], a:0, e:"에러 없이 멈추는 함정.", src:"강의", s:1},
    {t:"mc", c:8, q:"다음 코드가 하는 일은?", k:`if not TURSO_DATABASE_URL:
    raise RuntimeError("TURSO_DATABASE_URL 환경변수가 설정되지 않았습니다.")`, o:["값이 비어 있으면 즉시 멈춰 뒤늦은 엉뚱한 오류를 막는다","값을 자동으로 채운다","경고만 출력한다","DB를 만든다"], a:0, e:"잘못된 상태면 일찍 멈추는 것이 디버깅을 쉽게 한다.", src:"강의"},
    {t:"mc", c:8, q:"다음 코드가 하는 일은?", k:`client.execute(
    "INSERT INTO price_history (code, date, close) VALUES (?, ?, ?) "
    "ON CONFLICT (code, date) DO UPDATE SET close = excluded.close",
    [code, date_str, close_price],
)`, o:["같은 종목·날짜가 없으면 넣고, 있으면 종가를 새 값으로 덮어쓴다(upsert)","항상 새 행을 추가한다","같은 행이 있으면 오류를 낸다","행을 삭제한다"], a:0, e:"? 자리에 [code, date_str, close_price]가 순서대로 들어간다.", src:"강의", s:1},
    {t:"sa", c:8, q:"위 INSERT의 ON CONFLICT (code, date)는 무엇을 판정하는 기준인가?", k:`ON CONFLICT (code, date) DO UPDATE SET close = excluded.close`, a:"같은 종목·같은 날짜 행이 이미 있는 경우", al:["충돌 판정","같은 종목 같은 날짜","기본키 충돌"], e:"PRIMARY KEY (code, date) 덕분에 성립.", src:"강의"},
    {t:"mc", c:8, q:"다음 코드가 하는 일은?", k:`client.execute(
    "DELETE FROM price_history WHERE code = ? AND date NOT IN ("
    "SELECT date FROM price_history WHERE code = ? "
    "ORDER BY date DESC LIMIT ?)",
    [code, code, num_days],
)`, o:["종목별로 최근 num_days개 날짜만 남기고 오래된 행을 지운다","최근 날짜를 지운다","모든 행을 지운다","종목을 삭제한다"], a:0, e:"안쪽 SELECT가 남길 최신 날짜를 뽑고, 바깥 DELETE가 NOT IN으로 나머지 삭제.", src:"강의", s:1},
    {t:"sa", c:8, q:"위 DELETE에서 안쪽 SELECT가 뽑는 것은?", k:`SELECT date FROM price_history WHERE code = ? ORDER BY date DESC LIMIT ?`, a:"남길 최신 날짜들", al:["최신 날짜","남겨야 할 최신 N개 날짜","최근 15개 날짜"], e:"", src:"강의"},
    {t:"mc", c:8, q:"다음 SQL을 Turso 웹 콘솔에 넣으면 보이는 것은?", k:`SELECT * FROM price_history ORDER BY date DESC, code;`, o:["저장된 종가 행들이 최신 날짜 순(같은 날은 코드 순)으로 나온다","표가 삭제된다","행이 추가된다","표 구조만 나온다"], a:0, e:"행이 종목 수만큼 보이면 성공.", src:"강의"},
    {t:"mc", c:8, q:"다음 코드의 try / except / finally 구조에서 finally가 하는 일은?", k:`try:
    client.execute(...)
except Exception as e:
    print(f"❌[{code}] Turso DB에 종가 저장 실패: {e}")
finally:
    if own_client:
        client.close()`, o:["예외가 나도 직접 만든 연결이면 반드시 닫는다","예외를 다시 일으킨다","저장을 재시도한다","프로그램을 종료한다"], a:0, e:"own_client는 이 함수가 직접 만들었는지 기억한다. 밖에서 받은 것은 닫지 않는다.", src:"강의", s:1},
    {t:"mc", c:8, q:"다음 코드가 하는 일은?", k:`with get_turso_client() as client:
    for code in watchlist_codes:
        info = fetch_naver_current_price(code)
        if info is None:
            continue
        if info["is_open"]:
            continue
        update_price_history(code, date_str, info["price"], client=client)`, o:["클라이언트를 한 번만 만들어 종목마다 돌리고, 조회 실패·장중 종목은 건너뛰며 종가를 저장한다","종목마다 DB에 새로 접속한다","장중에도 종가를 저장한다","종목을 삭제한다"], a:0, e:"종목이 늘어도 연결·CREATE TABLE을 반복하지 않는다.", src:"강의", s:1},
    {t:"mc", c:8, q:"다음 코드가 하는 일은?", k:`traded_at = info.get("traded_at") or ""
if len(traded_at) >= 10:
    date_str = traded_at[:10].replace("-", "")
else:
    date_str = datetime.now(KST).strftime("%Y%m%d")`, o:["체결 시각의 날짜를 20260729 형태로 바꿔 저장 날짜로 쓰고, 없으면 실행 날짜(KST)로 대체한다","실행 시각을 항상 쓴다","traded_at을 삭제한다","시간을 초로 바꾼다"], a:0, e:"\"2026-07-29T16:10:20+09:00\"의 앞 10자리. 폴백을 지우면 필드가 빠질 때 프로그램이 죽는다.", src:"강의", s:1},
    {t:"sa", c:8, q:"traded_at이 \"2026-07-29T16:10:20+09:00\"일 때 date_str은?", k:`date_str = traded_at[:10].replace("-", "")`, a:"20260729", al:["20260729"], e:"", src:"강의", s:1},
    {t:"mc", c:8, q:"다음 코드(재시도)가 하는 일은?", k:`def fetch_naver_current_price(code, retries=2):
    for attempt in range(1, retries + 1):
        ...
        if attempt < retries:
            time.sleep(1)
    return None`, o:["실패하면 1초 쉬고 최대 retries번 시도하고, 끝내 실패하면 None을 반환한다","한 번만 시도한다","무한 반복한다","성공해도 계속 반복한다"], a:0, e:"종가 수집은 하루 한 번뿐이라 되돌릴 수 없는 실패를 막으려고 재시도를 넣는다.", src:"강의"},
    {t:"mc", c:8, q:"다음 코드에서 장중(is_open=True)일 때의 동작은?", k:`if info["is_open"]:
    print(f"⚠️ [{code}] 아직 장중입니다. 기록하지 않습니다.")
    continue`, o:["경고를 출력하고 그 종목은 저장하지 않고 다음 종목으로 넘어간다","종가로 저장한다","프로그램을 종료한다","재시도한다"], a:0, e:"종가가 아직 확정되지 않았다.", src:"강의"},
    {t:"mc", c:8, q:"자정이 지난 새벽에 이 코드(수정 전)를 돌리면 생기는 문제는?", k:`date_str = datetime.now(KST).strftime("%Y%m%d")`, o:["전날 종가를 오늘 날짜로 저장해 이틀 종가가 같아진다","날짜가 저장되지 않는다","오류가 난다","종가가 0이 된다"], a:0, e:"체결 시각(traded_at)으로 날짜를 정해 해결.", src:"강의", s:1},
    {t:"sa", c:8, q:"다음 .env 두 줄 중 DB 주소를 담은 변수 이름은?", k:`TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...`, a:"TURSO_DATABASE_URL", al:["DATABASE_URL"], e:"= 앞뒤 공백·따옴표 금지, 토큰은 한 줄.", src:"강의"},
    {t:"mc", c:8, q:"다음 코드를 토요일에 실행하면 저장되는 날짜는?", k:`date_str = traded_at[:10].replace("-", "")
update_price_history(code, date_str, info["price"], client=client)`, o:["금요일 (마지막 거래일)","토요일","일요일","저장되지 않음"], a:0, e:"체결 시각 기준 + upsert라 중복도 안 생긴다.", src:"강의"},

    // ══ 9장 그래프 왼쪽이 채워진다 ══
    {t:"mc", c:9, q:"다음 코드가 하는 일은?", k:`def load_price_history() -> dict:
    try:
        with get_turso_client() as client:
            result = client.execute("SELECT code, date, close FROM price_history"
                                    " ORDER BY code, date")
    except Exception as e:
        print(f"❌ Turso DB에서 종가 히스토리를 읽지 못했습니다: {e}")
        return {}`, o:["DB에서 종가를 날짜순으로 읽고, 실패하면 오류를 출력한 뒤 빈 딕셔너리를 반환한다","DB에 종가를 저장한다","실패하면 프로그램을 종료한다","종가를 삭제한다"], a:0, e:"실패해도 화면엔 에러가 안 뜬다(그래프는 오늘 하루치). 터미널 ❌ 한 줄이 유일한 신호.", src:"강의", s:1},
    {t:"mc", c:9, q:"다음 코드가 만드는 history의 형태는?", k:`history = {}
for code, date, close in result.rows:
    history.setdefault(code, []).append({"date": date, "close": close})`, o:["{종목코드: [{date, close}, …]} 형태의 딕셔너리","종가 리스트","DataFrame","튜플의 리스트"], a:0, e:"한 줄에 사실 하나인 DB 표를 종목별로 묶는다.", src:"강의", s:1},
    {t:"sa", c:9, q:"다음 코드에서 setdefault(code, [])의 역할은?", k:`history.setdefault(code, []).append({"date": date, "close": close})`, a:"키가 없으면 빈 리스트를 넣고 반환, 있으면 기존 리스트 반환", al:["없으면 빈 리스트 생성","키 없으면 빈 리스트 추가"], e:"if code not in history: history[code] = [] 세 줄을 한 줄로.", src:"강의", s:1},
    {t:"mc", c:9, q:"resolve_today_price가 None을 돌려주는 경우는?", k:`def resolve_today_price(price, is_open, intraday_minutes, daily_closes):
    return price if (is_open or intraday_minutes or not daily_closes) else None`, o:["장이 닫혔고, 분봉이 없고, 과거 종가가 있을 때","장이 열려 있을 때","분봉이 있을 때","과거 종가가 하나도 없을 때"], a:0, e:"휴장일에 어제 종가를 오늘 가격처럼 그리는 중복을 막는다.", src:"강의", s:1},
    {t:"sa", c:9, q:"위 함수에서 과거 종가가 하나도 없으면(처음 실행) 반환되는 값은?", k:`return price if (is_open or intraday_minutes or not daily_closes) else None`, a:"현재가 (price)", al:["price","현재가"], e:"빈 그래프를 막기 위해 현재가를 살린다.", src:"강의"},
    {t:"mc", c:9, q:"다음 코드(notify_stock_price.py)가 하는 일은?", k:`price_history = load_price_history()
daily_closes = price_history.get(code, [])
today_price = resolve_today_price(info["price"], info["is_open"],
                                  intraday_minutes, daily_closes)
chart_buffer = build_price_chart(daily_closes, today_price, intraday_minutes)`, o:["DB의 과거 종가를 읽어 오늘 점을 정한 뒤, 과거 종가+오늘 분봉이 있는 그래프를 만든다","현재가만 그린다","종가를 DB에 저장한다","그래프를 삭제한다"], a:0, e:"7장과 달라진 것은 daily_closes, today_price 두 값뿐.", src:"강의", s:1},
    {t:"mc", c:9, q:"다음 코드가 하는 일은?", k:`daily_closes = price_history.get(code, [])
if not daily_closes:
    print(f"⚠️ [{code}] 저장된 종가 히스토리가 없어 현재가만으로 그래프를 그립니다.")`, o:["그 종목의 종가가 DB에 아직 없을 때 경고를 출력한다","종목을 삭제한다","오류를 일으킨다","DB에 저장한다"], a:0, e:"collect_daily_close.py가 한 번도 안 돌았을 수 있다.", src:"강의"},
    {t:"mc", c:9, q:"다음 import 구문이 하는 일은?", k:`from stock_utils import (
    read_watchlist,
    load_price_history,
    fetch_naver_current_price,
)`, o:["같은 폴더의 stock_utils.py에 정의된 함수들을 이름으로 가져온다","stock_utils.py를 실행한다","함수를 삭제한다","파일을 복사한다"], a:0, e:"가져온 함수는 직접 정의한 것과 똑같이 호출. 목록에 없는 이름을 쓰면 NameError.", src:"강의", s:1},
    {t:"sa", c:9, q:"위 import에서 stock_utils.py가 같은 폴더에 없으면 발생하는 오류는?", k:`from stock_utils import (read_watchlist)`, a:"ModuleNotFoundError", al:["modulenotfounderror"], e:"", src:"강의"},
    {t:"mc", c:9, q:"다음 코드가 하는 일은? (stock_utils.py 앞부분)", k:`load_dotenv()
TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL")
KST = ZoneInfo("Asia/Seoul")`, o:[".env의 환경변수를 읽고 한국 시간대를 정의한다","DB를 만든다","그래프를 그린다","토큰을 출력한다"], a:0, e:"함수가 쓰는 상수·환경변수도 함께 옮겨야 NameError가 안 난다.", src:"강의"},
    {t:"mc", c:9, q:"다음 코드가 하는 일은?", k:`daily_x = _evenly_spaced(0.0, 0.5, len(daily_prices))
today_x = _evenly_spaced(0.5, 1.0, len(today_prices))
x = daily_x + today_x`, o:["과거 종가는 왼쪽 절반, 오늘 분봉은 오른쪽 절반에 균등하게 배치한다","전부 같은 간격으로 배치한다","오른쪽 끝에 몰아서 배치한다","정렬한다"], a:0, e:"점 개수가 아니라 보여주고 싶은 의미 단위로 자리를 나눈다.", src:"강의"},
    {t:"mc", c:9, q:"다음 코드(notify_stock_price.py)가 하는 일은?", k:`first_daily_closes = dedupe_daily_closes(first_daily_closes, first_today_price,
                                         first_intraday_minutes)
telegram_message += describe_price_trend(first_daily_closes, first_intraday_minutes)`, o:["그래프와 같은 필터를 거친 종가 목록으로 헤더 문구를 만들어 점 개수와 맞춘다","메시지를 삭제한다","종가를 저장한다","오늘 값을 두 번 넣는다"], a:0, e:"헤더가 ‘최근 15일’인데 점이 14개면 이상하므로.", src:"강의"}
  ]
});

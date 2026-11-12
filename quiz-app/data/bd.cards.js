// 빅데이터개론 암기카드 (문제은행과 별개). q=앞면, k=코드, a=뒷면 정답(단답), e=보충 설명
// 시험이 ‘코드를 보여주고 하는 일을 묻는’ 유형이라 대부분 코드 읽기 카드로 구성
(window.CARDS = window.CARDS || {}).bd = [
  // ── 7장 그래프가 사진으로 온다 ──
  {c:7,q:"이 코드가 하는 일은? (한 줄)",k:`def send_telegram_photo(photo_buffer: io.BytesIO, caption: str) -> bool:`,a:"메모리 이미지+캡션을 텔레그램으로 전송, 성공 여부 반환",e:"-> bool은 반환 타입 힌트."},
  {c:7,q:"io.BytesIO란?",a:"메모리 안의 가상 이진 파일",e:"디스크에 쓰지 않고 file-like object로 동작."},
  {c:7,q:"files 튜플 세 값은 각각 무엇인가?",k:`files = {"photo": ("chart.png", photo_buffer, "image/png")}`,a:"(파일이름, 파일내용, MIME 타입)",e:"\"chart.png\"는 텔레그램에 알려주는 이름일 뿐 실제 파일이 아님."},
  {c:7,q:"이 data 딕셔너리의 세 키가 뜻하는 것은?",k:`data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption, "parse_mode": "HTML"}`,a:"수신 방 · 캡션 · 캡션 서식(HTML)",e:"photo는 data가 아니라 files에 들어간다."},
  {c:7,q:"timeout=15의 의미와 성공 판정 기준은?",k:`response = requests.post(url, data=data, files=files, timeout=15)
return response.status_code == 200`,a:"15초 무응답이면 중단 · HTTP 200이면 True",e:"예외는 except에서 False."},
  {c:7,q:"sendMessage 대비 sendPhoto 호출에서 추가된 인자는?",k:`requests.post(url, data=data)
requests.post(url, data=data, files=files)`,a:"files=",e:""},
  {c:7,q:"캡션의 <b>가 굵은 글씨가 되게 하는 옵션은?",k:`"parse_mode": "HTML"`,a:"parse_mode=\"HTML\"",e:"html.escape()는 종목명 특수문자가 태그를 깨지 않게 함."},
  {c:7,q:"이 코드의 결과(intraday_by_code)의 자료형은?",k:`intraday_by_code = {code: fetch_naver_intraday_minutes(code)
                    for code in current_prices}`,a:"딕셔너리 {종목코드: 분봉}",e:"딕셔너리를 for로 돌면 키가 나온다."},
  {c:7,q:"이 코드가 꺼내는 값은?",k:`first_code = next(iter(current_prices))`,a:"맨 처음 키(종목코드)",e:"대표 종목 하나로 추이 문구를 한 번만."},
  {c:7,q:"for code, info in current_prices.items()에서 code와 info는?",a:"종목코드 · 가격 정보 딕셔너리",e:"items()는 (키, 값) 쌍."},
  {c:7,q:"7장에서 [] 자리는 무엇인가?",k:`chart_buffer = build_price_chart([], info["price"], intraday_minutes)`,a:"daily_closes (과거 종가, 아직 없음)",e:"그래서 왼쪽이 빈 그래프."},
  {c:7,q:"빈칸은?",k:`buffer = io.BytesIO()
fig.savefig(buffer, format="png")
plt.close(fig)
buffer.(   )(0)
return buffer`,a:"seek",e:"없으면 커서가 끝이라 0바이트를 읽어 전송 실패. plt.close는 메모리 회수."},
  {c:7,q:"matplotlib.use(\"Agg\")가 하는 일은?",k:`import matplotlib
matplotlib.use("Agg")`,a:"화면 없이 이미지로만 저장",e:""},
  {c:7,q:"plt.subplots()가 돌려주는 두 가지와 그리기·저장 대상은?",k:`fig, ax = plt.subplots()`,a:"fig(저장) · ax(그리기)",e:""},
  {c:7,q:"이 코드가 하는 일은?",k:`if intraday_minutes:
    today_prices = [m["price"] for m in intraday_minutes]
elif current_price is not None:
    today_prices = [current_price]
else:
    today_prices = []`,a:"오늘 가격 우선순위: 분봉 > 현재가 한 점 > 없음",e:"어떤 경우에도 멈추지 않음."},
  {c:7,q:"출력은?",k:`yi = 71500
print(f"{yi:,}")`,a:"71,500",e:"천 단위 콤마."},
  {c:7,q:"xytext=(0, 8)의 의미는?",k:`ax.annotate(f"{yi:,}", (xi, yi), textcoords="offset points",
            xytext=(0, 8), ha="center", fontsize=13)`,a:"점 위로 8포인트 띄운 값 라벨",e:""},
  {c:7,q:"이 코드가 강조하는 것은?",k:`ax.plot(x[-1], prices[-1], marker="o", color="#d62728")`,a:"마지막 지점(현재가) 빨간 점",e:"과거 종가는 파란 점."},
  {c:7,q:"이 코드가 하는 일은?",k:`for xi, m in zip(today_x, intraday_minutes):
    if m["time"].endswith("00"):
        tick_positions.append(xi)
        tick_labels.append(f"{m['time'][:2]}:{m['time'][2:]}")`,a:"정각 분봉만 09:00 형태 눈금으로",e:"분봉 300~400개를 다 표시하면 겹치므로."},
  {c:7,q:"반환값은?",k:`_evenly_spaced(0.0, 1.0, 5)`,a:"[0.0, 0.25, 0.5, 0.75, 1.0]",e:"n ≤ 0 → [], n == 1 → [start]."},
  {c:7,q:"7장에서 이 코드의 결과는? (daily_prices가 [])",k:`daily_x = _evenly_spaced(0.0, 0.5, len(daily_prices))`,a:"[] (빈 리스트)",e:"그래서 왼쪽 절반이 빈다."},
  {c:7,q:"이 코드가 하는 일은?",k:`today_str = datetime.now(KST).strftime("%Y%m%d")
return [e for e in daily_closes if e["date"] != today_str]`,a:"오늘 날짜 항목 제거 (중복 방지)",e:"7장은 [] 입력이라 아무 일도 안 함."},
  {c:7,q:"분봉만 있을 때(7장) 이 함수의 반환값은?",k:`if daily_closes:
    return f"최근 {len(daily_closes)}일 종가 + 현재가 추이"
if intraday_minutes:
    return "오늘 현재가 추이(종가 히스토리 누적 전)"
return "현재가(종가 히스토리 누적 전)"`,a:"오늘 현재가 추이(종가 히스토리 누적 전)",e:"daily_closes를 먼저 확인해 ‘최근 0일’을 막음."},
  {c:7,q:"이 코드가 하는 일은?",k:`minutes = [{"time": ts[8:], "price": int(p)} for ts, p in rows]
minutes.reverse()`,a:"시:분과 가격을 묶고 시간 오름차순으로 뒤집기",e:"응답이 최신순이라 reverse."},
  {c:7,q:"? 와 & 의 역할은?",k:`params = {"symbol": code, "requestType": 1, "startTime": date_str}
# → ?symbol=005930&requestType=1&startTime=…`,a:"? 쿼리 시작 · & 구분자",e:""},
  {c:7,q:"이 코드가 하는 일은?",k:`korean_fonts = [name for name in ("Malgun Gothic", "NanumGothic", "AppleGothic")
                if name in installed_fonts]
plt.rcParams["font.family"] = korean_fonts or ["sans-serif"]`,a:"설치된 한글 폰트만 지정, 없으면 sans-serif",e:"하나도 없으면 한글이 □로 깨짐."},
  {c:7,q:"이 except가 하는 일은?",k:`except Exception as e:
    print(f"분봉 조회 실패: {e}")
    return []`,a:"오류가 나도 빈 리스트로 계속 진행",e:""},
  {c:7,q:"‘사진은 안 오고 텍스트만’일 때 의심할 두 가지는?",a:"캡션 1024자 초과 · seek(0) 누락",e:""},
  {c:7,q:"7장에서 왼쪽이 빈 그래프는 정상인가 오류인가?",a:"정상",e:"과거 종가를 아직 저장하지 않았기 때문. 9장 이후에는 오류 신호."},

  // ── 8장 종가가 DB에 쌓인다 ──
  {c:8,q:"이 코드가 하는 일은?",k:`client.execute(
    "CREATE TABLE IF NOT EXISTS price_history ("
    "code TEXT NOT NULL, date TEXT NOT NULL, close INTEGER NOT NULL, "
    "PRIMARY KEY (code, date))"
)`,a:"종가 표가 없으면 생성 (기본키 code+date)",e:"IF NOT EXISTS라 몇 번 실행해도 안전."},
  {c:8,q:"PRIMARY KEY (code, date)의 약속은?",a:"같은 종목·같은 날짜는 한 줄만",e:"upsert가 성립하는 근거."},
  {c:8,q:"date를 TEXT(\"20260729\")로 두는 이유는?",a:"크기 비교·정렬이 그대로 되므로",e:""},
  {c:8,q:"이 코드가 하는 일은?",k:`url = TURSO_DATABASE_URL.replace("libsql://", "https://", 1)`,a:"WebSocket 막힘으로 인한 무한 대기 방지 (https로 접속)",e:"에러 없이 멈추는 함정."},
  {c:8,q:"이 코드가 하는 일은?",k:`if not TURSO_DATABASE_URL:
    raise RuntimeError("TURSO_DATABASE_URL 환경변수가 설정되지 않았습니다.")`,a:"값이 비면 즉시 중단",e:"잘못된 상태면 일찍 멈추는 것이 디버깅을 쉽게 함."},
  {c:8,q:"이 SQL이 하는 일은?",k:`INSERT INTO price_history (code, date, close) VALUES (?, ?, ?)
ON CONFLICT (code, date) DO UPDATE SET close = excluded.close`,a:"없으면 넣고 있으면 종가 덮어쓰기 (upsert)",e:"? 자리에 [code, date_str, close_price]가 순서대로."},
  {c:8,q:"빈칸은?",k:`INSERT ... (   ) (code, date) DO UPDATE SET close = (   ).close`,a:"ON CONFLICT · excluded",e:""},
  {c:8,q:"SQL의 ? 가 하는 일은?",a:"값 자리표시자 (값 개수·순서 일치 필요)",e:"문자열로 끼우면 쿼리 구조가 깨질 수 있다."},
  {c:8,q:"이 SQL이 하는 일은?",k:`DELETE FROM price_history WHERE code = ? AND date NOT IN (
  SELECT date FROM price_history WHERE code = ?
  ORDER BY date DESC LIMIT ?)`,a:"종목별 최근 N개 날짜만 남기고 삭제",e:"안쪽 SELECT = 남길 최신 날짜."},
  {c:8,q:"이 SQL을 웹 콘솔에서 실행하면 보이는 것은?",k:`SELECT * FROM price_history ORDER BY date DESC, code;`,a:"저장된 종가를 최신 날짜 순으로",e:"행이 종목 수만큼 보이면 성공."},
  {c:8,q:"finally가 하는 일은?",k:`try:
    client.execute(...)
except Exception as e:
    print(f"❌[{code}] Turso DB에 종가 저장 실패: {e}")
finally:
    if own_client:
        client.close()`,a:"예외가 나도 직접 만든 연결은 닫음",e:"own_client = 이 함수가 만들었는지."},
  {c:8,q:"own_client를 두는 이유는?",k:`own_client = client is None`,a:"밖에서 받은 연결을 닫지 않으려고",e:"닫으면 호출부가 다음 종목에서 에러."},
  {c:8,q:"이 코드가 하는 일은?",k:`with get_turso_client() as client:
    for code in watchlist_codes:
        info = fetch_naver_current_price(code)
        if info is None:
            continue
        if info["is_open"]:
            continue
        update_price_history(code, date_str, info["price"], client=client)`,a:"연결 1회로 종목별 종가 저장 (실패·장중 종목은 건너뜀)",e:""},
  {c:8,q:"이 코드가 하는 일은?",k:`if info["is_open"]:
    print(f"⚠️ [{code}] 아직 장중입니다. 기록하지 않습니다.")
    continue`,a:"장중이면 저장 안 하고 다음 종목으로",e:"종가가 아직 확정되지 않음."},
  {c:8,q:"이 코드가 하는 일은?",k:`traded_at = info.get("traded_at") or ""
if len(traded_at) >= 10:
    date_str = traded_at[:10].replace("-", "")
else:
    date_str = datetime.now(KST).strftime("%Y%m%d")`,a:"체결 시각의 날짜로 저장 (없으면 실행 날짜 KST)",e:"폴백을 지우면 필드가 빠질 때 프로그램이 죽는다."},
  {c:8,q:"date_str의 값은?",k:`traded_at = "2026-07-29T16:10:20+09:00"
date_str = traded_at[:10].replace("-", "")`,a:"20260729",e:""},
  {c:8,q:"자정 이후 이 줄의 문제는?",k:`date_str = datetime.now(KST).strftime("%Y%m%d")`,a:"전날 종가를 오늘 날짜로 저장",e:"체결 시각으로 날짜를 정해 해결."},
  {c:8,q:"이 재시도 코드가 하는 일은?",k:`def fetch_naver_current_price(code, retries=2):
    for attempt in range(1, retries + 1):
        ...
        if attempt < retries:
            time.sleep(1)
    return None`,a:"실패하면 1초 쉬고 최대 retries번 시도, 끝내 실패하면 None",e:"종가 수집은 하루 한 번이라 되돌릴 수 없는 실패를 막으려고."},
  {c:8,q:"TURSO_DATABASE_URL 줄은 무엇을 담는가?",k:`TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...`,a:"DB 주소",e:"AUTH_TOKEN은 접속 토큰. = 앞뒤 공백·따옴표 금지."},
  {c:8,q:"토요일에 실행하면 저장되는 날짜는?",k:`date_str = traded_at[:10].replace("-", "")`,a:"금요일 (마지막 거래일)",e:"체결 시각 기준 + upsert라 중복 없음."},
  {c:8,q:"실행 환경에 상태가 남지 않는 성질은?",a:"stateless",e:"그래서 파일 대신 DB."},
  {c:8,q:"수집 쪽에 휴장일 필터를 넣으면 나쁜 이유는?",a:"밀린 날 종가가 영구히 사라짐",e:"안 보내는 건 되돌릴 수 있지만 안 모은 건 못 되돌림."},
  {c:8,q:"‘Turso DB에 종가 저장 실패’의 흔한 원인은?",a:".env 값 앞뒤 공백·줄바꿈",e:"FAQ 2절 12번."},

  // ── 9장 그래프 왼쪽이 채워진다 ──
  {c:9,q:"이 함수가 하는 일은?",k:`def load_price_history() -> dict:
    try:
        with get_turso_client() as client:
            result = client.execute("SELECT code, date, close FROM price_history"
                                    " ORDER BY code, date")
    except Exception as e:
        print(f"❌ Turso DB에서 종가 히스토리를 읽지 못했습니다: {e}")
        return {}`,a:"DB 종가를 날짜순으로 읽음 (실패하면 {} 반환)",e:"실패해도 화면엔 에러가 안 뜸. 터미널 ❌가 유일한 신호."},
  {c:9,q:"history의 형태는?",k:`history = {}
for code, date, close in result.rows:
    history.setdefault(code, []).append({"date": date, "close": close})`,a:"{종목코드: [{date, close}, …]}",e:"한 줄에 사실 하나인 표를 종목별로 묶음."},
  {c:9,q:"setdefault(code, [])의 동작은?",k:`history.setdefault(code, []).append({"date": date, "close": close})`,a:"키가 없으면 빈 리스트 넣고 반환",e:"if code not in history: history[code] = [] 세 줄과 같다."},
  {c:9,q:"with 문의 효과는?",a:"블록이 끝나면 연결 자동 종료",e:"예외가 나도."},
  {c:9,q:"resolve_today_price가 None을 반환하는 조건은?",k:`return price if (is_open or intraday_minutes or not daily_closes) else None`,a:"장 닫힘 + 분봉 없음 + 과거 종가 있음",e:"휴장일에 어제 종가를 오늘 가격처럼 쓰는 것을 막음."},
  {c:9,q:"과거 종가가 하나도 없을 때(처음 실행) 반환값은?",k:`return price if (is_open or intraday_minutes or not daily_closes) else None`,a:"현재가 (price)",e:"빈 그래프 방지."},
  {c:9,q:"이 코드가 하는 일은?",k:`price_history = load_price_history()
daily_closes = price_history.get(code, [])
today_price = resolve_today_price(info["price"], info["is_open"],
                                  intraday_minutes, daily_closes)
chart_buffer = build_price_chart(daily_closes, today_price, intraday_minutes)`,a:"DB 과거 종가 + 오늘 점으로 그래프 생성",e:"7장과 달라진 것은 daily_closes, today_price 두 값."},
  {c:9,q:"today_price가 None이면 그래프는?",a:"‘오늘’ 점을 따로 그리지 않음",e:""},
  {c:9,q:"이 경고의 의미는?",k:`if not daily_closes:
    print(f"⚠️ [{code}] 저장된 종가 히스토리가 없어 현재가만으로 그래프를 그립니다.")`,a:"그 종목 종가가 DB에 아직 없음",e:"collect_daily_close.py를 한 번도 안 돌렸을 수 있음."},
  {c:9,q:"이 import 구문이 하는 일은?",k:`from stock_utils import (
    read_watchlist,
    load_price_history,
    fetch_naver_current_price,
)`,a:"stock_utils.py의 함수를 이름으로 가져옴",e:"목록에 없는 이름을 쓰면 NameError."},
  {c:9,q:"stock_utils.py가 같은 폴더에 없으면 나는 오류는?",k:`from stock_utils import read_watchlist`,a:"ModuleNotFoundError",e:""},
  {c:9,q:"이 줄들이 stock_utils.py 앞부분에 필요한 이유는?",k:`load_dotenv()
TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL")
KST = ZoneInfo("Asia/Seoul")`,a:"함수가 쓰는 환경변수·상수를 함께 옮겨야 NameError가 안 남",e:""},
  {c:9,q:"이 코드가 하는 일은?",k:`daily_x = _evenly_spaced(0.0, 0.5, len(daily_prices))
today_x = _evenly_spaced(0.5, 1.0, len(today_prices))
x = daily_x + today_x`,a:"과거는 왼쪽 절반, 오늘 분봉은 오른쪽 절반에 배치",e:"의미 단위로 자리를 나눔."},
  {c:9,q:"이 코드가 하는 일은?",k:`first_daily_closes = dedupe_daily_closes(first_daily_closes, first_today_price,
                                         first_intraday_minutes)
telegram_message += describe_price_trend(first_daily_closes, first_intraday_minutes)`,a:"그래프와 같은 필터를 거친 목록으로 헤더 문구 생성",e:"헤더 ‘최근 N일’과 점 개수를 맞춤."},
  {c:9,q:"중복 함수를 한 곳으로 모은 파일은?",a:"stock_utils.py",e:"read_watchlist, fetch_naver_current_price가 한 벌만 남음."},
  {c:9,q:"옮기기가 성공했다는 증거는?",a:"지난장과 똑같은 로그",e:"새 기능이 아니라 자리 이동."}
];

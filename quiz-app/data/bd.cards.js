// 빅데이터개론 암기카드 (문제은행과 별개). q=앞면, k=코드, a=뒷면 정답, e=보충 설명
(window.CARDS = window.CARDS || {}).bd = [
  // ── 7장 그래프가 사진으로 온다 ──
  {c:7,q:"주가 데이터 파이프라인의 다섯 단계와 7장의 위치는?",a:"수집 → 저장 → 가공 → 시각화 → 확인 / 13장 중 7장 ‘그래프가 사진으로 온다’",e:"5장 pandas·matplotlib → 6장 관심종목 전부 → 7장 그래프 사진 → 8장 종가 DB."},
  {c:7,q:"7장의 결과물은?",a:"종목마다 오늘 하루 가격 흐름 그래프가 텔레그램 사진으로 도착 — 그래프는 파일로 저장하지 않고 메모리에서 바로 전송, 가격·등락 두 줄은 사진 캡션으로 이동",e:"새로 배우는 것은 그리는 방법이 아니라 보내는 방법."},
  {c:7,q:"7장에 새로 생기는 함수 6개와 역할은?",a:"fetch_naver_intraday_minutes(오늘 분봉 조회) · build_price_chart(그래프 이미지 생성) · send_telegram_photo(이미지 전송) · describe_price_trend(그래프 설명 문구) · dedupe_daily_closes, _evenly_spaced(보조)",e:"호출부와 캡션 조립 부분을 이해하면 된다."},
  {c:7,q:"7장부터 ZIP에 watchlist.csv 대신 watchlist.example.csv가 들어 있는 이유는?",a:"매 장 압축을 덮어쓰면 내가 고친 종목이 기본 3종목으로 되돌아가기 때문 — 이미 watchlist.csv가 있으면 example은 무시",e:"없어졌다면 example을 복사해 이름을 watchlist.csv로 변경. 없으면 ‘❌ watchlist.csv 파일이 존재하지 않습니다’. .env도 .env.example만 포함."},
  {c:7,q:"sendMessage와 sendPhoto의 차이는?",a:"sendMessage: 글자(text), 글자 수 제한 넉넉 / sendPhoto: 이미지 + 캡션(1024자), 종목마다 한 장 — 코드 차이는 requests.post에 files= 하나뿐",e:"requests.post(url, data=...) vs requests.post(url, data=..., files=...)"},
  {c:7,q:"send_telegram_photo의 시그니처 의미는?",k:`def send_telegram_photo(photo_buffer: io.BytesIO, caption: str) -> bool:`,a:"photo_buffer: 메모리 이미지 버퍼 · caption: 이미지와 함께 보낼 설명 · -> bool: 전송 성공 여부 True/False를 반환한다는 타입 힌트",e:""},
  {c:7,q:"io.BytesIO란?",a:"메모리 안에 존재하는 가상의 이진(binary) 파일 — 디스크에 쓰지 않고 파일처럼 동작하는 객체(file-like object)",e:"read(), write(), seek(), tell(), getvalue() 제공."},
  {c:7,q:"send_telegram_photo ②단계의 세 가지 준비물은?",k:`url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto"
files = {"photo": ("chart.png", photo_buffer, "image/png")}
data = {"chat_id": TELEGRAM_CHAT_ID, "caption": caption, "parse_mode": "HTML"}`,a:"어디로(url) · 무엇을(files) · 어떤 옵션으로(data)",e:"files 튜플은 (파일이름, 파일내용, MIME 타입). \"chart.png\"는 실제 파일이 아니라 텔레그램에 알려주는 이름. data = 수신 방 chat_id, 캡션 caption, 캡션 서식 parse_mode."},
  {c:7,q:"send_telegram_photo ③단계에서 요청을 보내고 결과를 처리하는 코드는?",k:`try:
    response = requests.post(url, data=data, files=files, timeout=15)
    return response.status_code == 200
except Exception as e:
    print(f"[X] 텔레그램 이미지 전송 중 오류 발생: {e}")
    return False`,a:"POST 전송 → 15초 넘게 응답 없으면 중단(timeout=15) → HTTP 200이면 True / 어떤 예외가 나도 안전하게 False 반환",e:"except Exception as e: 예외 객체를 e에 담아 원인을 확인."},
  {c:7,q:"parse_mode=\"HTML\"과 html.escape()를 쓰는 이유는?",a:"parse_mode=\"HTML\"이라 캡션의 <b> 태그가 굵은 글씨가 됨 / html.escape()는 종목명에 특수문자가 섞여도 태그 구조가 깨지지 않게 함",e:"캡션은 일반 텍스트라 공백 4칸 들여쓰기가 그대로 유지된다."},
  {c:7,q:"분봉을 종목마다 미리 한 번에 모아 두는 코드와 결과 형태는?",k:`intraday_by_code = {code: fetch_naver_intraday_minutes(code)
                    for code in current_prices}`,a:"{종목 코드: 오늘 분봉 데이터} 딕셔너리 — current_prices를 for로 돌면 키(종목 코드)가 나온다",e:"필요할 때마다 호출(6장)하는 방식과 다른 점."},
  {c:7,q:"first_code = next(iter(current_prices))의 역할은?",a:"딕셔너리의 키(종목 코드) 이터레이터를 만들고 next로 맨 처음 키 하나만 꺼낸다 — 추이 문구는 종목마다 거의 같아 대표 종목 하나로 한 번만 붙이기 위해",e:""},
  {c:7,q:"build_price_chart를 호출하는 줄에서 세 인자의 의미는?",k:`for code, info in current_prices.items():
    intraday_minutes = intraday_by_code[code]
    chart_buffer = build_price_chart([], info["price"], intraday_minutes)`,a:"[] → daily_closes(과거 종가 목록, 아직 없음) / info[\"price\"] → current_price(오늘 값 하나) / intraday_minutes → 오늘 분봉 목록",e:"items()는 (키, 값) 쌍 순회: code는 종목 코드, info는 가격 관련 정보 딕셔너리. 결과 chart_buffer는 메모리 버퍼 형태의 차트 이미지."},
  {c:7,q:"5장과 7장 그래프 그리기의 차이는?",a:"순서(plt.subplots → ax.plot → ax.annotate → fig.savefig)는 같고, 7장은 마지막이 fig.savefig(buffer)로 바뀜 / 5장은 아무 숫자 리스트, 7장은 진짜 주가",e:"5장이 결과물 없는 장처럼 보였다면 그 이유가 7장에 드러난다."},
  {c:7,q:"build_price_chart의 특징 5가지는?",a:"그리는 기계 / 환경별 한글 폰트 선택 / 과거 종가는 점 + 값 라벨, 오늘 분봉은 선 / x축을 왼쪽 절반(과거)·오른쪽 절반(오늘)으로 분할 / 마지막 지점만 빨간 점",e:"점 개수가 과거 15개 vs 분봉 수백 개라 그냥 이으면 과거가 왼쪽 끝에 뭉친다."},
  {c:7,q:"build_price_chart의 매개변수와 기본값, 반환 타입은?",k:`def build_price_chart(daily_closes: list, current_price: int = None,
                      intraday_minutes: list = None) -> io.BytesIO:
    import matplotlib
    matplotlib.use("Agg")`,a:"daily_closes(과거 종가 목록) · current_price(오늘 값 하나) · intraday_minutes(오늘 분봉 목록) — 뒤의 둘은 = None 기본값이라 생략 가능 / 반환은 메모리 버퍼 / Agg = 화면 없이 이미지로만 저장",e:"과거 종가만 넘겨도 함수는 돈다."},
  {c:7,q:"그래프를 버퍼로 돌려주는 맨 뒤 다섯 줄은?",k:`buffer = io.BytesIO()
fig.savefig(buffer, format="png")
plt.close(fig)
buffer.seek(0)
return buffer`,a:"가상 파일 생성 → 버퍼에 png 저장 → fig 닫아 메모리 회수(안 닫으면 fig가 쌓임) → 커서를 맨 앞으로(seek(0)) → 버퍼 반환",e:"seek(0)이 없으면 savefig 직후 커서가 맨 끝이라 0바이트를 읽어 전송 실패. 가장 실수하기 쉬운 지점."},
  {c:7,q:"오늘 구간에 그릴 데이터의 우선순위와 코드 구조는?",k:`if intraday_minutes:
    today_prices = [m["price"] for m in intraday_minutes]
elif current_price is not None:
    today_prices = [current_price]
else:
    today_prices = []`,a:"분봉 > 현재가 한 점 > 없음 — if: 분봉이 있으면 수백 개 점(장중) / elif: 현재가만 있으면 점 하나(장 시작 전·주말) / else: 둘 다 없으면 조회 실패, 과거 종가만 그림",e:"어떤 경우에도 프로그램은 멈추지 않는다."},
  {c:7,q:"plt.subplots()가 돌려주는 것과 이후 그리기/저장 대상은?",a:"fig(그림 전체)와 ax(실제 그리는 좌표축) — 그리기는 ax에, 저장은 fig에",e:"과거+오늘 prices 전체를 선 하나로 긋는 것이 핵심."},
  {c:7,q:"f\"{yi:,}\"와 xytext=(0, 8)의 의미는?",a:"천 단위 콤마 서식(71500 → 71,500) / 라벨을 점 기준 위로 8포인트 띄움",e:"ax.annotate(f\"{yi:,}\", (xi, yi), textcoords=\"offset points\", xytext=(0, 8), ha=\"center\", fontsize=13)"},
  {c:7,q:"그래프 마지막 지점만 빨간 점으로 찍는 코드는?",k:`if today_prices:
    ax.plot(x[-1], prices[-1], marker="o", color="#d62728")`,a:"x[-1], prices[-1] = 마지막 지점 하나 — 현재가를 강조",e:"과거 종가는 파란 점(#1f77b4) + 값 라벨."},
  {c:7,q:"x축 눈금에 정각(HH:00)만 표시하는 이유와 방법은?",k:`for xi, m in zip(today_x, intraday_minutes):
    if m["time"].endswith("00"):
        tick_positions.append(xi)
        tick_labels.append(f"{m['time'][:2]}:{m['time'][2:]}")`,a:"분봉이 하루 300~400개라 전부 표시하면 겹치므로 정각만(6~7개) / zip으로 좌표와 분봉을 묶고, \"0900\"을 슬라이싱 [:2], [2:]로 09:00 형태로 바꿈 / 라벨은 45도 기울임",e:"“데이터가 많다”가 곧 “보기 좋다”는 아니다. 골라 보여주는 것도 설계."},
  {c:7,q:"_evenly_spaced(start, end, n)의 동작은?",k:`if n <= 0: return []
if n == 1: return [start]
step = (end - start) / (n - 1)
return [start + step * i for i in range(n)]`,a:"[start, end] 구간에 n개의 점을 균등 간격으로 배치 / n ≤ 0 → [] / n == 1 → [start] / start=0, end=1, n=5 → [0, 0.25, 0.5, 0.75, 1]",e:"과거 daily_x = _evenly_spaced(0.0, 0.5, ...), 오늘 today_x = _evenly_spaced(0.5, 1.0, ...). 히스토그램 구간 경계·축 눈금·시뮬레이션 시점 배열에도 쓰임."},
  {c:7,q:"7장에서 _evenly_spaced(0.0, 0.5, len(daily_prices))가 []를 돌려주는 이유는?",a:"과거 종가가 0개이기 때문 (n ≤ 0 경우) — 이번 장의 과거 종가가 정확히 이 경우",e:"그래서 왼쪽 절반이 비어 있다."},
  {c:7,q:"dedupe_daily_closes의 역할과 7장에서의 동작은?",k:`today_str = datetime.now(KST).strftime("%Y%m%d")
return [e for e in daily_closes if e["date"] != today_str]`,a:"오늘 날짜(KST, '20260815' 형식)와 같은 항목을 과거 목록에서 빼서 장마감 뒤 같은 값이 두 번 찍히는 것을 방지 / 7장은 첫 인자가 []라 걸러낼 것이 없어 아무 일도 안 함(9장부터 일함)",e:"오늘 가격·분봉이 모두 없으면 daily_closes를 변형 없이 그대로 반환."},
  {c:7,q:"describe_price_trend의 문구 세 가지와 나오는 상황은?",k:`if daily_closes:
    return f"최근 {len(daily_closes)}일 종가 + 현재가 추이"
if intraday_minutes:
    return "오늘 현재가 추이(종가 히스토리 누적 전)"
return "현재가(종가 히스토리 누적 전)"`,a:"과거 종가 있음 → ‘최근 N일 종가 + 현재가 추이’(9장부터) / 분봉만 → ‘오늘 현재가 추이(종가 히스토리 누적 전)’(7장, 정상) / 둘 다 없음 → ‘현재가(종가 히스토리 누적 전)’(장 시작 전)",e:"daily_closes를 먼저 확인해야 히스토리 0일일 때 ‘최근 0일 종가’가 나오지 않는다."},
  {c:7,q:"7장에서 그래프 왼쪽이 비어 있는 이유와 의미는?",a:"과거 종가를 어디에도 저장하지 않았기 때문 — 고장이 아니라 정상, ‘채울 자리가 남은 그래프’. 오늘 분봉만 그려져 오른쪽 절반만 채워짐",e:"daily_x가 빈 리스트(거짓)라 if daily_x: 블록이 통째로 건너뛰어짐. 8장에서 DB에 종가를 쌓아 채운다."},
  {c:7,q:"같은 ‘오늘 현재가 추이(종가 히스토리 누적 전)’ 화면이 7장과 9장 이후에 갖는 의미 차이는?",a:"7장: 정상 / 9장 이후: DB를 못 읽은 것 — 화면은 같아도 장에 따라 뜻이 정반대",e:"신규 종목을 추가하면 그 종목만 왼쪽이 비는 것은 운영에서도 정상."},
  {c:7,q:"종목이 3개일 때 실행 결과와 성공/실패 판단 기준은?",a:"텍스트 1통 + 사진 3장 / 🎉 줄이 종목 수만큼 나오면 정상, 한 종목만 ❌여도 실패 아님 — 하나도 못 보냈을 때만 실패",e:"python notify_stock_price.py (python3)."},
  {c:7,q:"분봉 API의 응답이 response.json()으로 안 되는 이유와 대처는?",a:"EUC-KR 인코딩과 깨진 문자가 섞인 비표준 JSON이라서 — 숫자 데이터 행만 정규식 re.findall()로 뽑는다",e:"헤더의 한글 라벨은 깨지지만 숫자 데이터 행은 멀쩡하다. 비공식 API는 공식 문서가 없어 열어보고 판단해야 한다."},
  {c:7,q:"re.findall()로 뽑은 분봉을 시간 오름차순 리스트로 만드는 코드와 이유는?",k:`minutes = [{"time": ts[8:], "price": int(p)} for ts, p in rows]
minutes.reverse()`,a:"12자리 시각(ts)에서 ts[8:]로 시:분만, p는 int로 가격 / 응답이 최신순이라 reverse()로 뒤집는다",e:"결과: [{\"time\": \"0900\", \"price\": 71000}, …, {\"time\": \"1530\", ...}] — 하루 300~400개. 실패하면 빈 리스트."},
  {c:7,q:"requests.get의 params가 URL에 붙는 형태와 각 기호의 뜻은?",k:`params = {"symbol": code, "requestType": 1, "startTime": date_str,
          "endTime": date_str, "timeframe": "minute"}`,a:"?symbol=005930&requestType=1&… — ? 쿼리 문자열의 시작 · 키=값 · & 파라미터 사이 구분자",e:"이 API는 저장해 둔 것이 아니라 그때그때 다시 계산해 주므로 우리가 저장할 필요가 없다."},
  {c:7,q:"분봉 조회가 실패하거나 장이 안 열렸을 때 fetch_naver_intraday_minutes의 반환과 그래프는?",a:"빈 리스트를 반환 — 프로그램은 계속 가고 그래프도 그려진다",e:"except Exception as e: print(...) 후 return []."},
  {c:7,q:"한글 폰트를 설치된 것만 걸러서 지정하는 이유와 하나도 없을 때 결과는?",k:`korean_fonts = [name for name in ("Malgun Gothic", "NanumGothic", "AppleGothic")
                if name in installed_fonts]
plt.rcParams["font.family"] = korean_fonts or ["sans-serif"]`,a:"세 이름을 그냥 나열하면 없는 이름마다 findfont 경고가 글자 하나하나에 찍혀 로그가 수백 줄로 덮이므로 / 하나도 없으면 sans-serif로 떨어져 한글이 네모(□)로 깨진다",e:"윈도우 맑은고딕, 맥 애플고딕, 리눅스는 한글 폰트가 없을 수도(10장에서 나눔고딕 설치)."},
  {c:7,q:"‘사진은 안 오고 텍스트만 온다’면 의심할 원인은?",a:"캡션이 너무 길거나(1024자 초과) buffer.seek(0)이 빠졌을 수 있다",e:"그래프에 점이 하나뿐이면 7·8장에서는 정상, 장 시작 전이면 현재가 한 점만 찍힘, 한글이 □면 폰트 없음."},
  {c:7,q:"7장 제출물과 할 일은?",a:"제출물: ①그래프가 온 텔레그램 화면(스크린샷) ②GitHub 저장소 화면 / send_telegram_photo 읽고 sendMessage와 차이 말하기 · 실행해 사진 받기 · 장중(9:00~15:30)과 장마감 후 각각 실행해 차이 보기 · 그래프 왼쪽이 왜 비었는지 설명 · 소스 제어에서 Commit → Sync Changes",e:"왼쪽이 빈 그래프가 정답이다. 채워진 것이 오면 오히려 이상하다."},
  {c:7,q:"7장 정리 5가지는?",a:"①io.BytesIO에 그린 그래프를 파일 저장 없이 그대로 전송 ②sendMessage와 비슷하게 sendPhoto가 생기고 종목 정보는 캡션으로 이동 ③그리는 법은 5장, 이번 장에서 새로 배운 것은 보내는 법 ④그래프 왼쪽이 비는 것은 정상(과거 종가를 아직 모으지 않음) ⑤다음 장에서 그 빈자리를 채울 종가를 DB에 쌓기 시작",e:""}
];

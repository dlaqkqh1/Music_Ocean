from selenium import webdriver
from bs4 import BeautifulSoup
import re
import mysql.connector
import datetime

# 차트창이



# 사람인지 인증시켜주는 헤더
header = {'User-Agent': ''}

# chrome 드라이버 경로 설정
d = webdriver.Chrome("D:\chromedriver_win32/chromedriver")
d.implicitly_wait(3)


# 데이터베이스 접속
mydb = mysql.connector.connect(
    user="root",
    passwd="cksdn12z",
    database = "music_ocean",
    auth_plugin='mysql_native_password'
)
mycursor = mydb.cursor()
print(mydb)

# 차트가 시작되는 날짜 지정
startdate = "20181224"
year = startdate[:4]
month = startdate[4:6]
startdate = datetime.datetime.strptime(startdate,"%Y%m%d").date()

# 수집할 차트의 기간을 설정 (현재 1주로 설정됨)
cycle = datetime.timedelta(weeks=1)
date = startdate
strdate = date.strftime('%Y%m%d')

# 시작하는 날짜가 몇 주차 차트인지 설정 (예 : 1주부터 파싱을 시작하면 0으로 설정)
week = 3

while True: 
    # bugs 차트 정보 사이트로 이동
    d.get('https://music.bugs.co.kr/chart/track/week/total?chartdate=' + strdate)
    html = d.page_source
    soup = BeautifulSoup(html, "html.parser")
    period = soup.select('#container > section > div > fieldset > time')[0].text.replace('캘린더 레이어 띄움','').replace(' ', '').replace('\t','').replace('\n','').replace(',',', ')
    print(period)
    split_period=period.split('~')
    week = week + 1
    day = split_period[1][8:10]
    
    # 다음으로 크롤링할 날짜 계산
    if (split_period[0][5:7] != split_period[1][5:7] and int(day) > 3) or int(split_period[0][8:10]) <= 4:
        year = split_period[1][:4]
        week = 1
        month = split_period[1][5:7]
    print(year, month, week)

    parser = soup.find_all("a", {"class": "trackInfo"})
    song_ids = []
    for song_id in parser: # 차트에 있는 곡 아이디 파싱
        song_id = ''.join(re.findall(r'\d+', str(song_id)))
        song_id = song_id[:-2]
        song_ids.append(song_id)
    for rank in range(1, 51):
        d.switch_to_window(d.window_handles[1])
        d.get('https://music.bugs.co.kr/track/'+ song_ids[rank-1] +'?wl_ref=list_tr_08_chart')
        html = d.page_source
        soup = BeautifulSoup(html, "html.parser")
        
        # 곡 제목 파싱
        title = soup.select('#container > header > div > h1')[0].text.replace('[19금]','').replace('\t','').replace('\n','').replace(',',', ')

        # 아티스트 파싱
        artist = soup.select('#container > section.sectionPadding.summaryInfo.summaryTrack > div > div.basicInfo > table > tbody > tr > td')[0].text.replace(' ', '').replace('\t','').replace('\n','').replace(',',', ')

        # 앨범 이름 파싱
        if soup.select('#container > section.sectionPadding.summaryInfo.summaryTrack > div > div.basicInfo > table > tbody > tr > th')[1].text == '앨범':
             album = soup.select('#container > section.sectionPadding.summaryInfo.summaryTrack > div > div.basicInfo > table > tbody > tr > td')[1].text
        else:
            album = soup.select('#container > section.sectionPadding.summaryInfo.summaryTrack > div > div.basicInfo > table > tbody > tr > td')[2].text

        # 곡 길이 파싱
        playtime = soup.find_all('time')[0].text
        
        # 곡 좋아요 수 파싱
        like = soup.select('#container > section.sectionPadding.summaryInfo.summaryTrack > div > div.etcInfo > span > a > span > em')[0].text.replace(',','')
        
        # 곡 댓글의 갯수 파싱
        commant = soup.select('#basicInfoTotalCount > span')[0].text
        try: # 곡 가사 파싱
            lyric = soup.select('#container > section.sectionPadding.contents.lyrics > div > div > xmp')[0].text
        except:
            lyric=''
            print('lyric is not eixst.')
        title = re.sub('^\s*|\s+$', '', title)
        print(title)
        print(artist)
        print(album)
        print(playtime)
        print(commant)
        print(like)
        print('-----------------')

        try: # 데이터베이스에 저장
            sql = 'INSERT INTO charts (year, month, week, ranking, site, song_id) VALUES (%s, %s, %s, %s, %s, %s)'
            data = (year + '년', month + '월', week, rank, 'bugs', song_ids[rank - 1])
            mycursor.execute(sql, data)
        except:  # 저장하려는 정보가 이미 존재하면 메세지 출력
            print('rank is already exist.')
        try:
            sql = 'insert into songs (song_id, site, title, artist, album, playtime, like_num, reply_num, lyric) values (%s, %s, %s, %s, %s, %s, %s, %s, %s)'
            data = (song_ids[rank - 1], 'bugs', title, artist, album, '00:'+playtime, like, commant, lyric)
            mycursor.execute(sql, data)
        except:
            print('song id is already exist.')
        d.switch_to_window(d.window_handles[0])
    mydb.commit()
    date += cycle
    strdate = date.strftime('%Y%m%d')
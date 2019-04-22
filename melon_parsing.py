from selenium import webdriver
from bs4 import BeautifulSoup
from time import sleep
import re
import mysql.connector

# 사람인지 인증시켜주는 헤더
header = {'User-Agent': ''}

# chrome 드라이버 경로 설정
d = webdriver.Chrome("D:\chromedriver_win32/chromedriver")

# melon 차트 정보 사이트로 이동
d.get("https://www.melon.com/chart/index.htm")
d.get("https://www.melon.com/chart/search/index.htm")

sleep(5)

# 데이터베이스 접속
mydb = mysql.connector.connect(
    user="root",
    passwd="cksdn12z",
    database = "music_ocean",
auth_plugin='mysql_native_password'
)
mycursor = mydb.cursor()
print(mydb)


for a in range(1, 2): # 년도 범위를 지정해준다
    d.find_element_by_xpath('//*[@id="d_chart_search"]/div/h4[1]/a').click()
    d.implicitly_wait(3)
    years_xpath = '//*[@id="d_chart_search"]/div/div/div[1]/div[1]/ul/li[1]/span/label'
    d.find_element_by_xpath(years_xpath).click()

    try:
        year_xpath = '//*[@id="d_chart_search"]/div/div/div[2]/div[1]/ul/li[' + str(a) + ']/span/label'
        year = d.find_element_by_xpath(year_xpath)
        year.click()
        year_text = year.text
        print(year.text)

    except:
        print("year_xpath not found")
        continue

    for b in range(12, 13): # 월 범위를 지정해준다

        try:
            month_xpath = '//*[@id="d_chart_search"]/div/div/div[3]/div[1]/ul/li[' + str(b) + ']/span/label'
            month = d.find_element_by_xpath(month_xpath)
            month.click()
            month_text = month.text
            print(month.text)

        except:
            print("month_xpath not found")
            continue
        for c in range(4, 6): # 주 범위를 지정해준다
            try:
                week_xpath = '//*[@id="d_chart_search"]/div/div/div[4]/div[1]/ul/li['+str(c)+']/span/label'
                week = d.find_element_by_xpath(week_xpath)
                week.click()
                print(week.text)

            except:
                print("week_xpath not found")
                continue

            classCd = d.find_element_by_xpath('//label[@for = "gnr_1"]')

            print(classCd.text)
            classCd.click()

            d.find_element_by_xpath('//*[@id="d_srch_form"]/div[2]/button/span/span').click()
            sleep(3)
            song_ids = d.find_elements_by_xpath('//*[@id="lst50"]/td[4]/div/a') # 차트에 있는 곡 아이디 파싱
            song_ids = [re.sub('[^0-9]', '', song_id.get_attribute("href")) for song_id in song_ids]
            ranks = d.find_elements_by_xpath('//*[@id="lst50"]/td[2]/div/span[1]') # 차트에 있는 순위 파싱

            for rank, song_id in zip(ranks, song_ids):
                d.switch_to_window(d.window_handles[1])

                d.get('http://www.melon.com/song/detail.htm?songId=' + song_id) # 곡 정보 사이트로 이동
                html = d.page_source # 셀레니움으로 페이지 정보 수집
                soup = BeautifulSoup(html, "html.parser")

                title = soup.find(attrs={"class": "song_name"}).text.replace('곡명', '') # 곡 제목 파싱

                reply = soup.select('#revCnt')[0].text.replace('개','').replace(',','') # 곡 댓글의 갯수 파싱

                like = soup.select('#d_like_count')[0].text.replace(',','') # 곡 좋아요 수 파싱

                print(reply)

                if '19금' in title:
                    title = title.replace('19금', '') # 노래가 19금인 경우엔 19금 표시 제거

                title = re.sub('^\s*|\s+$', '', title)

                artist = soup.find(attrs={"class": "artist_name"}).text # 아티스트 파싱

                album = soup.select('#downloadfrm > div > div > div.entry > div.meta > dl > dd')[0].text # 앨범 이름 파싱

                genre = soup.select('#downloadfrm > div > div > div.entry > div.meta > dl > dd')[2].text # 장르 파싱

                d.switch_to.window(d.window_handles[0])
                try: # 데이터베이스에 저장
                    sql = 'INSERT INTO charts (year, month, week, ranking, site, song_id) VALUES (%s, %s, %s, %s, %s, %s)'
                    data = (year_text, month_text, int(c), int(rank.text), 'melon', int(song_id))
                    mycursor.execute(sql, data)
                except: # 저장하려는 정보가 이미 존재하면 메세지 출력
                    print('rank is already exist.')
                try:
                    sql = 'insert into songs (song_id, site, title, artist, album, genre, like_num, reply_num) values (%s, %s, %s, %s, %s, %s, %s, %s)'
                    data = (song_id, 'melon',title, artist, album, genre, like, reply)
                    mycursor.execute(sql, data)
                    print("곡 id:", song_id)
                    print("제목:", title)
                    print("아티스트:", artist)
                    print("앨범:", album)
                    print("장르:", genre)
                except:
                    print("song_id is already exist.")
                    pass
            mydb.commit()

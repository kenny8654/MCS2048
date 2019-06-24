import pandas as pd
import sys,time

while True:
        
    url = 'http://course-query.acad.ncku.edu.tw/qry/qry001.php?dept_no=Q3'
    tables = pd.read_html(url)
    if tables[0].loc[17,"餘額"] == "額滿":
        time.sleep(1)
        continue
    else:
        print('1',end="")
        sys.exit(0)
        break



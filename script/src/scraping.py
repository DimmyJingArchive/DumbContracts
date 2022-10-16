from bs4 import BeautifulSoup
import cfscrape
import math 
import json, time

def scrape(addr_num):
    # Scraping for smart contract addresses 
    file = open('../data/scraped.json')
    res = json.load(file)
    file.close()
    print(f"Imported length of {len(res)}")

    scraper = cfscrape.create_scraper()
    p1, p2 = 987, math.ceil(addr_num / 100)
    for p in range(p1,p2+1):
        print(f"page {p}/{p2}")
        r = scraper.get(f'https://bscscan.com/txs?ps=100&p={p}')
        soup = BeautifulSoup(r.content, 'html.parser')
        # table = soup.find('id="paywall_mask"')
        # table = soup.find(lambda tag: tag.name=='table' and tag.has_attr('id') and tag['id']=="paywall_mask")
        success = False
        while not success:
            try:
                table = soup.find(id="paywall_mask")
                rows = table.findAll(lambda tag: tag.name=='tr')[1:]
                success = True
            except:
                with open('../data/scraped.json', 'w') as f:
                    json.dump(res, f)
                print(f'waiting for page {p}')
                time.sleep(180)
            
        for row in rows:
            if row.find('i', class_='far fa-file-alt text-secondary'):
                # Transaction Hash
                start = 'href="/tx/'
                # print(txnHash_col)
                txnHash_col = str(list(row)[1])
                txnHash = txnHash_col[txnHash_col.find(start)+len(start):][:67].replace('"', '').replace('>','')

                # Method 
                # print(type(row))
                method = row.find('span', class_='u-label u-label--xs u-label--info rounded text-dark text-center').get('title')

                # Block Number
                # block_col = str(list(row)[3])
                block = row.find('td', class_='d-none d-sm-table-cell').text
                # print(block)

                # Age 
                # age_col = str(list(row)[4])
                age = row.find('td', class_='showDate').text
                # print(age)

                start = 'href="/address/'
                # The FROM Address
                addrFrom_col = str(list(row)[6])
                addrFrom = addrFrom_col[addrFrom_col.find(start)+len(start):][:44].replace('"', '').replace('>','')

                # The TO Address
                addrTo_col = str(list(row)[8])
                addrTo = addrTo_col[addrTo_col.find(start)+len(start):][:43].replace('"', '').replace('>','')

                # Value
                value = row.select_one(":nth-child(10)").text

                #TXN FEE
                txnFee = row.select_one(":nth-child(11)").text
                res.append((txnHash, method, block, age, addrFrom, addrTo, value, txnFee))
        time.sleep(1)
    with open('../data/scraped.json', 'w') as f:
        json.dump(res, f)
    return res
if __name__ == "__main__":
    scrape(500000)
    # bs = BeautifulSoup(html.read(), 'html.parser')

    # print(table.prettify())

    # json_object = json.dumps(res, indent=4)
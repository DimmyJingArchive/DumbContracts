from scraping import scrape
import requests, json, time, os
from dotenv import load_dotenv
load_dotenv()
BSC_API_KEY = os.environ.get("BSC_API_KEY") 

# scraped_contracts = scrape(100)
file = open('../data/scraped.json')
scraped_contracts = json.load(file)
file.close()
def get_contract_info(scraped_contracts):
    all_data = {}
    for i, contract in enumerate(scraped_contracts):
        contract_address = contract[5]
        
        if contract_address not in all_data:
            print(f"{i + 1}/{len(scraped_contracts)}")
            source_code_json = None
            try:
                r = requests.get(f"https://api.bscscan.com/api?module=contract&action=getsourcecode&address={contract_address}&apikey={BSC_API_KEY}")
                source_code_json = r.json()
            except:
                with open('../data/contracts.json', 'w') as f:
                    json.dump(all_data, f, indent=2)
            all_data[contract_address] = {
                "transactions": [],
                "contractData": source_code_json["result"][0],
            }
            # time.sleep(0.2)

        all_data[contract_address]["transactions"].append({
            "txnHash": contract[0],
            "method": contract[1],
            "block": contract[2],
            "age": contract[3],
            "addrFrom": contract[4].strip(),
            "value": contract[6],
            "txnFee": contract[7],
        })

    with open('../data/contracts.json', 'w') as f:
        json.dump(all_data, f, indent=2)
        
if __name__ == "__main__":
    get_contract_info(scraped_contracts)
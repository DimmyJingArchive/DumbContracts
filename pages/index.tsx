import { ContractCard } from "stories/contractcard/ContractCard";
import { SearchBar } from "stories/searchbar/SearchBar";
import { ContractCardData, all_data, all_risk_map, getTags } from "core/data";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Logo() {
  return (
    <div className="absolute left-12 top-8 rounded-lg overflow-hidden">
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="48pt"
        height="51pt"
        viewBox="0 0 300 320"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0,320) scale(0.1,-0.1)"
          fill="rgb(148, 163, 184)"
          stroke="none"
        >
          <path
            d="M1986 3132 c75 -50 217 -174 270 -238 23 -27 77 -103 121 -169 108
-165 165 -311 199 -512 25 -147 25 -150 21 -663 -4 -563 -6 -581 -72 -780 -89
-266 -294 -525 -565 -712 -24 -16 2 -17 488 -17 l512 -1 0 1565 0 1565 -517 0
-516 0 59 -38z"
          />
          <path
            d="M70 2986 l0 -125 653 -4 c703 -4 684 -2 825 -60 83 -33 155 -78 229
-141 192 -163 289 -350 314 -598 7 -76 9 -265 7 -540 -5 -389 -7 -429 -26
-499 -45 -167 -114 -288 -228 -403 -111 -112 -230 -183 -390 -233 l-89 -27
-517 -4 -518 -3 0 875 0 876 -125 0 -125 0 0 -1000 0 -1001 663 3 662 4 100
27 c201 54 390 169 535 324 177 189 275 400 300 644 13 126 13 883 0 1004 -28
261 -133 480 -324 671 -150 150 -318 249 -514 302 l-97 26 -667 4 -668 3 0
-125z"
          />
          <path
            d="M60 2480 l0 -130 265 0 265 0 0 -875 0 -875 344 0 c390 0 442 6 566
67 110 54 224 170 278 284 22 46 45 108 51 137 15 72 15 962 0 1034 -38 185
-198 372 -378 443 -109 42 -158 45 -789 45 l-602 0 0 -130z m1241 -134 c75
-17 134 -53 193 -115 94 -101 91 -81 94 -605 3 -446 2 -460 -19 -523 -29 -87
-112 -178 -201 -219 -63 -29 -63 -29 -295 -32 l-233 -4 0 756 0 756 203 0
c132 0 221 -5 258 -14z"
          />
          <path
            d="M1090 1605 l0 -505 70 0 c86 0 133 18 160 62 19 32 20 49 20 443 0
394 -1 411 -20 443 -27 44 -74 62 -160 62 l-70 0 0 -505z"
          />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [contractData, setContractData] = useState<ContractCardData[]>([]);
  const [searched, setSearched] = useState<string>("");
  const [riskMap, setRiskMap] = useState(all_risk_map);
  useEffect(() => {
    fetch("http://localhost:5010/search?q=" + searched)
      .then((data) => data.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        let act_data: ContractCardData[] = [];
        for (let i = 0; i < data.length; i++) {
          act_data.push({
            name: data[i][1].contractData.ContractName,
            address: data[i][0],
            license: data[i][1].contractData.LicenseType,
            last_used:
              data[i][1].transactions[data[i][1].transactions.length - 1].age,
            safety_score:
              all_risk_map[data[i][0]] !== undefined
                ? all_risk_map[data[i][0]].data.trust_score
                : undefined,
            transactions: data[i][1].transactions.length,
            tags:
              all_risk_map[data[i][0]] !== undefined
                ? getTags(all_risk_map[data[i][0]])
                : undefined,
          });
          if (all_risk_map[data[i][0]] === undefined) {
            fetch("http://localhost:5010/get-risk/" + data[i][0])
              .then((data) => data.json())
              .then((data) => {
                setRiskMap((prevState) => ({
                  ...prevState,
                  [data["address"]]: data,
                }));
                all_risk_map[data["address"]] = data;
              });
          }
        }
        console.log(JSON.stringify(act_data));
        setContractData(act_data);
        all_data.result = data;
      });
  }, [searched]);
  return (
    <motion.div
      className="mx-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Logo />
      <div className="mt-10 mb-20">
        <SearchBar
          onSearch={(search: string) => {
            setSearched(search);
          }}
        />
      </div>
      {contractData.map((el) => (
        <div className="my-4" key={el.name}>
          <ContractCard
            name={el.name}
            address={el.address}
            license={el.license}
            last_used={el.last_used}
            safety_score={
              el.safety_score ||
              (riskMap[el.address] !== undefined
                ? riskMap[el.address].data.trust_score
                : undefined)
            }
            transactions={el.transactions}
            tags={
              el.tags ||
              (riskMap[el.address] !== undefined
                ? getTags(riskMap[el.address])
                : undefined)
            }
            onClick={(address: string) => router.push(address)}
          />
        </div>
      ))}
    </motion.div>
  );
}

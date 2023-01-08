import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faExchangeAlt,
  faScaleBalanced,
  faClock,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  ContractCardData,
  getAllTags,
  all_risk_map,
  dateToEpoch,
  epochToDate,
} from "core/data";
import { AnimatePresence, motion } from "framer-motion";
import Highlight from "react-highlight";
import Ellipses from "stories/assets/Ellipses.gif";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import ReactMarkdown from "react-markdown";

type ContractInstanceProps = ContractCardData & {
  source_code: string;
  all_transactions: any;
  onBack: () => void;
};

const descriptions: { [name: string]: string } = {
  abandoned:
    "This contract has no transaction for a period of time. This contract can be from an abandoned project, or the contract is either locked or has lost vitality. It is not recommended to invest in an abandoned contract since it is unlikely to earn benefit from the contract or the deposit fund may be locked.",
  "access control":
    "The contract’s owner or deployer has too much control over the contract, and the owner may have direct/indirect control of the users' funds such as locking and transferring. It is important to double check the contract deployer is trustworthy before interacting with such contracts.",
  vulnerable:
    "The contract itself contains logical/programming vulnerabilities that may be attacked by the 3rd party attackers or lead to unexpected outcomes. Users may lose their funds if they interact with the contract. it is not recommended to invest in or interact with a vulnerable contract since users might experience unexpected outcomes.",
  honeypot:
    "The (token) contract has limited the users’ ability to sell the token freely, and it is possible that users are unable to get their investment on this token back since they cannot sell the token. It is not recommended to invest any Honeypot token.",
  rugpull:
    "The contract contains logical or programming backdoors that are able to drain users’ funds. The contract owner / deployer may perform rugpulls by calling privileged functions, dumping their tokens or migrating the contract. It is not recommended to invest in a rugpull contract since all of the funds can be lost.",
  scam: "The contract performs differently from what the project owners advertised, and such inequality (between advertisement and actual performance) will lead to unexpected results. For example, a contract deployer may advertise his contract as an “auto trading bot” but when users interact with the contract, all of the user funds will be transferred to the deployer’s address. It is not recommended to interact with a scam contract since all of the funds can be lost.",
  "unverified source code":
    "The contract source code is unverified on BscScan.com, thus we are unable to analyze the security of the contract. The contract can either be benign or malicious. It is not recommended to interact with an unverified contract since any unexpected result could happen, including losing all the funds.",
  "proxy risky":
    "Contracts which are behind a proxy may contain unknown risk. This field is only valid if the contract is open source.",
  risky:
    "The contract contains one or more risks that might influence users' funds. It is not recommended to interact with a risky contract.",
};

const NUM_BINS = 50;

export const ContractInstance = ({
  name,
  address,
  license,
  last_used,
  safety_score,
  transactions,
  tags,
  source_code,
  all_transactions,
  onBack,
}: ContractInstanceProps) => {
  const [epochData, setEpochData] = useState([]);
  const [uniqueSenders, setUniqueSenders] = useState(-1);
  const [volume, setVolume] = useState(-1);
  const [method, setMethod] = useState("");
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState("");

  function handle_analyze() {
    setResult("loading...");
    fetch("http://localhost:5010/analyze", {
      method: "POST",
      body: JSON.stringify({ source_code: source_code }),
    })
      .then((data) => data.json())
      .then((data) => {
        setResult(data.message);
      })
      .catch((err) => {
        setResult("An error occurred while requesting result from GPT-3");
      });
  }

  if (epochData.length === 0) {
    let resEpochs = [];
    for (let i = 0; i < all_transactions.length; i++)
      resEpochs.push(dateToEpoch(all_transactions[i].age));
    resEpochs.sort();
    const range = resEpochs[resEpochs.length - 1] - resEpochs[0];
    const stepSize = range / NUM_BINS;
    let bins = [];
    for (let i = 0; i < NUM_BINS; i++) bins.push(0);
    let idx = 0;
    for (let i = 0; i < NUM_BINS; i++) {
      while (resEpochs[idx] < resEpochs[0] + stepSize * (i + 1)) {
        bins[i]++;
        idx++;
      }
    }
    let result = [];
    for (let i = 0; i < NUM_BINS; i++) {
      result.push({
        epoch: epochToDate(parseInt(resEpochs[0] + stepSize * i)),
        count: bins[i],
      });
    }
    setEpochData(result);
  }
  if (uniqueSenders === -1) {
    let senderSet = new Set();
    for (let i = 0; i < all_transactions.length; i++)
      senderSet.add(all_transactions[i].addrFrom);
    setUniqueSenders(senderSet.size);
  }
  if (volume === -1) {
    let actVolume = 0;
    for (let i = 0; i < all_transactions.length; i++)
      actVolume += parseFloat(all_transactions[i].value);
    setVolume(actVolume);
  }
  if (method === "") {
    let methodCounts = {};
    for (let i = 0; i < all_transactions.length; i++) {
      if (methodCounts[all_transactions[i].method] === undefined)
        methodCounts[all_transactions[i].method] = 0;
      methodCounts[all_transactions[i].method]++;
    }
    let maxCount = -1;
    let maxMethod = "N/A";
    for (let i in methodCounts) {
      if (methodCounts[i] > maxCount) {
        maxCount = methodCounts[i];
        maxMethod = i;
      }
    }
    setMethod(maxMethod);
  }
  return (
    <>
      <motion.button
        className="absolute top-10 left-28 text-3xl"
        onClick={() => onBack()}
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: 20 }}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-slate-200" />
      </motion.button>
      <AnimatePresence>
        {saved && (
          <motion.span
            style={{ top: 76 }}
            className="absolute left-28 text-slate-200"
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0 }}
          >
            Copied!
          </motion.span>
        )}
      </AnimatePresence>
      <div className="mx-40 divide-y divide-slate-600">
        <motion.div
          className="flex flex-row overflow-hidden text-slate-200 bg-slate-900 pb-3 pt-3 justify-between"
          layoutId={"contract_layout_" + address}
        >
          <div className="px-4 flex-col">
            <div className="flex flex-row my-2 font-bold">
              <h1 className="text-5xl mr-2">{name}</h1>
              <div className="flex flex-row items-end mb-1">
                {tags !== undefined &&
                  tags.map((tag_name) => (
                    <span
                      className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-red-600 bg-red-200 uppercase last:mr-0 mr-1 h-min"
                      key={tag_name}
                    >
                      {tag_name}
                    </span>
                  ))}
                {tags !== undefined && tags.length === 0 && (
                  <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-green-600 bg-green-200 uppercase last:mr-0 mr-1 h-min">
                    no threats detected
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row divide-x divide-slate-700">
              <button
                className="pr-2"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  setSaved(true);
                  setTimeout(() => setSaved(false), 1000);
                }}
              >
                <FontAwesomeIcon icon={faFileAlt} className="text-sm" />
                <span className="text-slate-400 text-sm ml-1 font-light">
                  {address}
                </span>
              </button>
              {license !== undefined && (
                <div className="px-2">
                  <FontAwesomeIcon icon={faScaleBalanced} className="text-sm" />
                  <span className="text-slate-400 text-sm ml-1">MIT</span>
                </div>
              )}
              <div className="px-2">
                <FontAwesomeIcon icon={faClock} className="text-sm" />
                <span className="text-slate-400 text-sm ml-1">
                  Last Used: {last_used}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between text-right pl-4">
            <div className="flex flex-row justify-center mt-2">
              <div className="flex flex-col text-left mr-3 mt-0.5 text-slate-400">
                <span className="leading-none text-sm">Safety</span>
                <span className="text-sm">Score</span>
              </div>
              <div className="mr-4">
                {safety_score === undefined && (
                  <Image src={Ellipses} width={40} height={40} />
                )}
                {safety_score >= 0 && safety_score < 60 && (
                  <div className="w-10">
                    <span className="text-3xl font-bold text-red-300 w-10">
                      {safety_score}
                    </span>
                  </div>
                )}
                {safety_score >= 60 && safety_score < 80 && (
                  <div className="w-10">
                    <span className="text-3xl font-bold text-orange-300 w-10">
                      {safety_score}
                    </span>
                  </div>
                )}
                {safety_score >= 80 && (
                  <div className="w-10">
                    <span className="text-3xl font-bold text-green-300 w-10">
                      {safety_score}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-row h-min mr-4 font-light justify-center">
              <div className="flex flex-col justify-center">
                <FontAwesomeIcon icon={faExchangeAlt} className="text-sm" />
              </div>
              <h1 className="text-2xl ml-1">{transactions} txns</h1>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 0.2 }}
          className="divide-y divide-slate-600"
        >
          <div className="flex flex-row flex-wrap py-4">
            {getAllTags(all_risk_map[address]).map((tag) => (
              <div
                className="text-red-300 border-red-300 w-80 border rounded-xl p-4 m-4"
                key={tag}
              >
                <h1 className="text-3xl mb-2 font-bold">{tag.toUpperCase()}</h1>
                <span className="font-light">{descriptions[tag]}</span>
              </div>
            ))}
            {getAllTags(all_risk_map[address]).length === 0 && (
              <div
                className="text-green-300 border-green-300 w-80 border rounded-xl p-4 m-4"
                key={"no risk"}
              >
                <h1 className="text-3xl mb-2 font-bold">
                  {"no risk".toUpperCase()}
                </h1>
                <span className="font-light">
                  There were no serious risks detected from the smart contract
                  at this time, but this does not guarantee the safety of the
                  smart contract.
                </span>
              </div>
            )}
          </div>
          <div className="py-4 text-slate-400">
            <h1 className="text-center text-5xl font-bold mb-4">
              Transaction History
            </h1>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={epochData}>
                <XAxis dataKey="epoch" stroke="rgb(148, 163, 184)" />
                <YAxis stroke="rgb(148, 163, 184)" />
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(51, 65, 85)" />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="py-8 text-slate-400 flex flex-row justify-around">
              <div className="flex flex-col mx-4 text-center">
                <h1 className="text-3xl font-bold mb-2">Unique Senders: </h1>
                <h1 className="text-3xl font-light">{uniqueSenders}</h1>
              </div>
              <div className="flex flex-col mx-4 text-center">
                <h1 className="text-3xl font-bold mb-2">Volume: </h1>
                <h1 className="text-3xl font-light">{volume} BNB</h1>
              </div>
              <div className="flex flex-col mx-4 text-center">
                <h1 className="text-3xl font-bold mb-2">Most Used Method: </h1>
                <h1 className="text-3xl font-light">{method}</h1>
              </div>
            </div>
          </div>
          <div className="pt-4 mb-4">
            <h1 className="text-center text-5xl font-bold mb-4 text-slate-400">
              Source Code
            </h1>
            <div className="max-h-screen overflow-auto border border-slate-700">
              <Highlight language="solidity">{source_code}</Highlight>
            </div>
            <div className="flex flex-row justify-end">
              <button
                className="rounded p-1 text-slate-300 bg-green-600 px-8 mt-4 text-lg"
                onClick={handle_analyze}
              >
                Analyze
              </button>
            </div>
          </div>
          {result && (
            <div className="pt-4 pb-20">
              <ReactMarkdown className="font-light text-slate-400 text-lg whitespace-pre-wrap">
                {result}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

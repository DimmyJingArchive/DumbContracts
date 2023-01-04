import Image from "next/image";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faExchangeAlt,
  faScaleBalanced,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { ContractCardData } from "core/data";
import { motion } from "framer-motion";
import Ellipses from "stories/assets/Ellipses.gif";

type ContractCardProps = ContractCardData & {
  onClick: (address: string) => void;
};

export const ContractCard = ({
  name,
  address,
  license,
  last_used,
  safety_score,
  transactions,
  tags,
  onClick,
}: ContractCardProps) => (
  <motion.div
    className="flex rounded-xl flex-row drop-shadow-xl overflow-hidden text-slate-200 bg-slate-800 pb-3 pt-3 justify-between divide-x divide-slate-700 hover:bg-slate-700 cursor-pointer"
    onClick={() => onClick(address)}
    layoutId={"contract_layout_" + address}
  >
    <div className="px-4 flex-col">
      <div className="flex flex-row my-2 font-bold">
        <h1 className="text-5xl mr-2">{name}</h1>
        <div className="flex flex-row items-end mb-1">
          {tags !== undefined &&
            tags.map((tag_name) => (
              <motion.span
                className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-red-600 bg-red-200 uppercase last:mr-0 mr-1 h-min"
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                key={tag_name}
              >
                {tag_name}
              </motion.span>
            ))}
          {tags !== undefined && tags.length === 0 && (
            <motion.span
              className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-green-600 bg-green-200 uppercase last:mr-0 mr-1 h-min"
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
            >
              no threats detected
            </motion.span>
          )}
        </div>
      </div>
      <div className="flex flex-row divide-x divide-slate-700">
        <div className="pr-2">
          <FontAwesomeIcon icon={faFileAlt} className="text-sm" />
          <span className="text-slate-400 text-sm ml-1 font-light">
            {address}
          </span>
        </div>
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
);

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faExchangeAlt,
  faScaleBalanced,
  faClock,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import Highlight from "react-highlight";

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ReactMarkdown from "react-markdown";

export default function SourceCodeModal({
  open,
  setOpen,
  sourceCode,
  setSourceCode,
}) {
  const cancelButtonRef = useRef(null);
  const [tempSourceCode, setTempSourceCode] = useState(sourceCode);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-900 px-4 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-medium leading-6 text-slate-400"
                    >
                      Edit Solidity Code
                    </Dialog.Title>
                    <div className="mt-2">
                      <textarea
                        rows={16}
                        name="comment"
                        id="comment"
                        className="block p-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-slate-800 text-slate-400"
                        value={tempSourceCode}
                        onChange={(event) =>
                          setTempSourceCode(event.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={() => {
                      setSourceCode(tempSourceCode);
                      setOpen(false);
                    }}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

type AnalysisProps = {
  name?: string;
  address?: string;
  license?: string;
  last_used?: string;
  transactions?: number;
  source_code?: string;
  onBack?: () => void;
};

export const Analysis = ({
  name,
  address,
  license,
  last_used,
  transactions,
  source_code,
  onBack,
}: AnalysisProps) => {
  name = name ?? "Unnamed";
  address = address ?? "N/A";
  license = license ?? "N/A";
  last_used = last_used ?? "N/A";
  transactions = transactions ?? 0;
  source_code =
    source_code ??
    `// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.17 and less than 0.9.0
pragma solidity ^0.8.17;

contract HelloWorld {
  string public greet = "Hello World!";
}`;
  const [sourceCode, setSourceCode] = useState(source_code);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState("");

  function handle_analyze() {
    setResult("loading...");
    fetch("http://localhost:5010/analyze", {
      method: "POST",
      body: JSON.stringify({ source_code: sourceCode }),
    })
      .then((data) => data.json())
      .then((data) => {
        setResult(data.message);
      })
      .catch((err) => {
        setResult("An error occurred while requesting result from GPT-3");
      });
  }

  return (
    <>
      {onBack && (
        <motion.button
          className="absolute top-10 left-28 text-3xl"
          onClick={() => onBack()}
          initial={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 20 }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-slate-200" />
        </motion.button>
      )}
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
              <div className="flex flex-col text-left mr-3 mt-0.5 text-slate-400"></div>
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
          <div className="pt-4 mb-4">
            <h1 className="text-center text-5xl font-bold mb-4 text-slate-400">
              Source Code
            </h1>
            <div className="max-h-screen overflow-auto border border-slate-700">
              <Highlight language="solidity">{sourceCode}</Highlight>
            </div>
            <div className="flex flex-row justify-end">
              <button
                className="rounded p-1 text-slate-300 bg-sky-600 px-8 mt-4 text-lg mr-4"
                onClick={() => setOpen(true)}
              >
                Edit
              </button>
              <button
                className="rounded p-1 text-slate-300 bg-green-600 px-8 mt-4 text-lg"
                onClick={handle_analyze}
              >
                Analyze
              </button>
            </div>
          </div>
          <div className="pt-2 pb-20">
            <ReactMarkdown className="font-light text-slate-400 text-lg whitespace-pre-wrap">
              {result}
            </ReactMarkdown>
          </div>
        </motion.div>
        <SourceCodeModal
          open={open}
          setOpen={setOpen}
          sourceCode={sourceCode}
          setSourceCode={(code) => {
            setSourceCode(code);
            setResult("");
          }}
        />
      </div>
    </>
  );
};

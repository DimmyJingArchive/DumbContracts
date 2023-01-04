import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ContractCardData, all_data, all_risk_map, getTags } from "core/data";
import { ContractInstance } from "stories/contractinstance/ContractInstance";

export default function Contract() {
  const router = useRouter();
  const { address } = router.query;
  const [contractInfo, setContractInfo] =
    useState<
      | (ContractCardData & { source_code: string; all_transactions: any })
      | undefined
    >(undefined);
  useEffect(() => {
    if (contractInfo === undefined) {
      for (let i = 0; i < all_data.result.length; i++) {
        if (all_data.result[i][0] === address)
          setContractInfo({
            name: all_data.result[i][1].contractData.ContractName,
            address: all_data.result[i][0],
            license: all_data.result[i][1].contractData.LicenseType,
            last_used:
              all_data.result[i][1].transactions[
                all_data.result[i][1].transactions.length - 1
              ].age,
            safety_score:
              all_risk_map[all_data.result[i][0]] !== undefined
                ? all_risk_map[all_data.result[i][0]].data.trust_score
                : undefined,
            transactions: all_data.result[i][1].transactions.length,
            tags:
              all_risk_map[all_data.result[i][0]] !== undefined
                ? getTags(all_risk_map[all_data.result[i][0]])
                : undefined,
            source_code: all_data.result[i][1].contractData.SourceCode,
            all_transactions: all_data.result[i][1].transactions,
          });
      }
    }
  }, [address]);
  if (contractInfo === undefined) return <></>;
  return (
    <ContractInstance
      name={contractInfo.name}
      address={contractInfo.address}
      license={contractInfo.license}
      last_used={contractInfo.last_used}
      safety_score={contractInfo.safety_score}
      transactions={contractInfo.transactions}
      tags={contractInfo.tags}
      source_code={contractInfo.source_code}
      all_transactions={contractInfo.all_transactions}
      onBack={() => router.push("/")}
    />
  );
}

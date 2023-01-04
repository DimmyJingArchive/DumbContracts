export type TagContent =
  | "abandoned"
  | "access control"
  | "vulnerable"
  | "honeypot"
  | "rugpull"
  | "scam"
  | "unverified source code"
  | "proxy risky"
  | "risky";

export interface ContractCardData {
  name: string;
  address: string;
  license?: string;
  last_used: string;
  safety_score?: number;
  transactions: number;
  tags?: TagContent[];
}

export const all_data: { result: ContractCardData[] } = { result: [] };
export const all_risk_map: { [address: string]: any } = {};

const risk_good_map: { [name: string]: (val: string) => boolean } = {
  open_source: (value: string) => parseInt(value) === 1,
  cannot_buy: (value: string) => parseInt(value) === 0,
  is_mintable: (_: string) => true,
  modifiable_tax: (value: string) => parseInt(value) === 0,
  cannot_sell_all: (value: string) => parseInt(value) === 0,
  honeypot: (value: string) => parseInt(value) === 0,
  external_call: (value: string) => parseInt(value) === 0,
  proxy_contract: (value: string) => parseInt(value) === 0,
  buy_tax: (value: string) => parseInt(value) === 0,
  owner_address: (value: string) => value.length > 0,
  take_back_ownership: (value: string) => parseInt(value) === 0,
  modifiable_balance: (value: string) => parseInt(value) === 0,
  personal_modifiable_tax: (value: string) => parseInt(value) === 0,
  self_destruct: (value: string) => parseInt(value) === 0,
  hidden_owner: (_: string) => true,
  trading_cooldown: (value: string) => parseInt(value) === 0,
  sell_tax: (value: string) => parseInt(value) === 0,
  trust_list: (value: string) => parseInt(value) === 1,
};

const TagSet = new Set([
  "abandoned",
  "access control",
  "vulnerable",
  "honeypot",
  "rugpull",
  "scam",
  "unverified source code",
  "proxy risky",
  "risky",
]);

export function getAllTags(data): TagContent[] {
  if (
    data === undefined ||
    data.data === undefined ||
    data.data.risk_details === undefined
  )
    return [];
  const risk_details: {
    name: string;
    labels?: TagContent[];
    value: string;
    sources: string[];
  }[] = data.data.risk_details;
  let tags: Set<TagContent> = new Set();
  for (let i = 0; i < risk_details.length; i++) {
    if (risk_details[i].labels === null) continue;
    let has_label = false;
    for (let j = 0; j < risk_details[i].labels.length; j++) {
      if (TagSet.has(risk_details[i].labels[j])) has_label = true;
    }
    if (
      has_label &&
      risk_good_map[risk_details[i].name] !== undefined &&
      !risk_good_map[risk_details[i].name](risk_details[i].value)
    ) {
      for (let j = 0; j < risk_details[i].labels.length; j++) {
        if (TagSet.has(risk_details[i].labels[j]))
          tags.add(risk_details[i].labels[j]);
      }
    } else if (has_label && risk_good_map[risk_details[i].name] === undefined) {
      console.log(JSON.stringify(risk_details[i]));
    }
  }
  return Array.from(tags);
}

export function getTags(data): TagContent[] {
  return getAllTags(data).slice(0, 3);
}

export function dateToEpoch(date: string): number {
  return new Date(date).valueOf();
}

export function epochToDate(epoch: number): string {
  return new Date(epoch).toISOString().slice(11, 16);
}

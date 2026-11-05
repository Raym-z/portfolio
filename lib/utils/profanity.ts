const BAD_WORDS = [
  "ass",
  "asshole",
  "bastard",
  "bitch",
  "bollocks",
  "bullshit",
  "cock",
  "crap",
  "cunt",
  "dick",
  "dipshit",
  "douche",
  "dumbass",
  "fag",
  "faggot",
  "fuck",
  "jackass",
  "motherfucker",
  "nigga",
  "nigger",
  "piss",
  "prick",
  "pussy",
  "retard",
  "shit",
  "slut",
  "twat",
  "wanker",
  "whore",
  "anjg",
  "anjing",
  "anjir",
  "anjay",
  "anjeng",
  "asu",
  "asw",
  "babi",
  "bajingan",
  "bangke",
  "bangsat",
  "bego",
  "bgsd",
  "bodoh",
  "bokep",
  "brengsek",
  "cok",
  "coli",
  "cuk",
  "germo",
  "goblok",
  "goblog",
  "idiot",
  "jancok",
  "jancuk",
  "kampret",
  "kimak",
  "kntl",
  "kontol",
  "kunyuk",
  "lonte",
  "mampus",
  "memek",
  "mmk",
  "ngehe",
  "ngentod",
  "ngentot",
  "ngewe",
  "pantek",
  "pepek",
  "perek",
  "pukimak",
  "setan",
  "sundal",
  "tai",
  "tempik",
  "titit",
  "tolol",
] as const;

const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "2": "z",
  "3": "e",
  "4": "a",
  "5": "s",
  "6": "g",
  "7": "t",
  "8": "b",
  "9": "g",
  "@": "a",
  $: "s",
  "!": "i",
  "|": "i",
};

const SUFFIXES = [
  "s",
  "es",
  "ed",
  "ing",
  "in",
  "er",
  "ers",
  "y",
  "ies",
  "hole",
  "head",
  "face",
  "ass",
];

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[0-9@$!|]/g, (char) => LEET_MAP[char] ?? char)
    .replace(/[^a-z]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collapseRepeats(value: string) {
  return value.replace(/(.)\1+/g, "$1");
}

const RAW_WORDS = BAD_WORDS.map(normalize);
const RAW_SET = new Set(RAW_WORDS);
const COMPACT_WORDS = RAW_WORDS.map(collapseRepeats);
const COMPACT_SET = new Set(COMPACT_WORDS);

function hasSuffixMatch(token: string, words: readonly string[]) {
  return words.some((word) => {
    if (word.length < 4 || !token.startsWith(word)) return false;
    return SUFFIXES.includes(collapseRepeats(token.slice(word.length)));
  });
}

function matchesWord(token: string) {
  if (RAW_SET.has(token)) return true;
  if (hasSuffixMatch(token, RAW_WORDS)) return true;

  if (token.length < 4) return false;

  const compact = collapseRepeats(token);
  if (COMPACT_SET.has(compact)) return true;
  return hasSuffixMatch(compact, COMPACT_WORDS);
}

export function containsProfanity(value: string) {
  const normalized = normalize(value);
  if (!normalized) return false;

  const tokens = normalized.split(" ");
  if (tokens.some(matchesWord)) return true;

  let singleLetterRun = "";
  for (const token of tokens) {
    if (token.length === 1) {
      singleLetterRun += token;
      continue;
    }

    if (singleLetterRun) {
      if (matchesWord(singleLetterRun)) return true;
      singleLetterRun = "";
    }
  }

  return singleLetterRun ? matchesWord(singleLetterRun) : false;
}

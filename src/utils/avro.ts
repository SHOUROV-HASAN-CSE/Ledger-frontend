/**
 * A comprehensive Avro-style phonetic parser for Bengali.
 * Converts English text to Bengali phonetically.
 *
 * Usage:
 * import { toBengali } from './avro';
 * console.log(toBengali('ami banglay gan gai')); // আমি বাংলায় গান গাই
 */

const vowels: Record<string, string> = {
  o: "অ",
  a: "আ",
  i: "ই",
  I: "ঈ",
  u: "উ",
  U: "ঊ",
  ri: "ঋ",
  e: "এ",
  E: "এ",
  OI: "ঐ",
  O: "ও",
  OU: "ঔ",
};

const vowelSigns: Record<string, string> = {
  o: "",
  a: "া",
  i: "ি",
  I: "ী",
  u: "ু",
  U: "ূ",
  ri: "ৃ",
  e: "ে",
  E: "ে",
  OI: "ৈ",
  O: "ো",
  OU: "ৌ",
};

const consonants: Record<string, string> = {
  k: "ক",
  kh: "খ",
  g: "গ",
  gh: "ঘ",
  Ng: "ঙ",
  c: "চ",
  ch: "ছ",
  j: "জ",
  jh: "ঝ",
  NG: "ঞ",
  T: "ট",
  Th: "ঠ",
  D: "ড",
  Dh: "ঢ",
  N: "ণ",
  t: "ত",
  th: "থ",
  d: "দ",
  dh: "ধ",
  n: "ন",
  p: "প",
  ph: "ফ",
  f: "ফ",
  b: "ব",
  bh: "ভ",
  v: "ভ",
  m: "ম",
  z: "য",
  r: "র",
  l: "ল",
  sh: "শ",
  S: "ষ",
  s: "স",
  h: "হ",
  R: "ড়",
  Rh: "ঢ়",
  y: "য়",
  Y: "য়",
  ng: "ং",
  ":": "ঃ",
  "^": "ঁ",
  ".": "।",
};

const conjuncts: Record<string, string> = {
  kkh: "ক্ষ",
  kkhN: "ক্ষ্ণ",
  kkhm: "ক্ষ্ম",
  Ngk: "ঙ্ক",
  Ngkh: "ঙ্খ",
  Ngx: "ঙ্ক্ষ",
  Ngg: "ঙ্গ",
  Nggh: "ঙ্ঘ",
  cch: "চ্ছ",
  cchb: "চ্ছ্ব",
  jj: "জ্জ",
  jjh: "জ্ঝ",
  TT: "ট্ট",
  DD: "ড্ড",
  tt: "ত্ত",
  tth: "ত্থ",
  dd: "দ্দ",
  ddh: "দ্ধ",
  nn: "ন্ন",
  pp: "প্প",
  pph: "প্‌ফ",
  bb: "ব্ব",
  bbh: "ব্ভ",
  mm: "ম্ম",
  ll: "ল্ল",
  shc: "শ্চ",
  shch: "শ্ছ",
  ShT: "ষ্ট",
  ShTh: "ষ্ঠ",
  sk: "স্ক",
  skh: "স্খ",
  st: "স্ত",
  sth: "স্থ",
  sp: "স্প",
  sph: "স্ফ",
};

// Hybrid patterns for typing (e.g. 'ক' + 'h' -> 'খ')
const hybrids: Record<string, string> = {
  কh: "খ",
  গh: "ঘ",
  চh: "ছ",
  জh: "ঝ",
  টh: "ঠ",
  ডh: "ঢ",
  তh: "থ",
  দh: "ধ",
  পh: "ফ",
  বh: "ভ",
  নg: "ং",
  সh: "শ",
};

// Combine all patterns
const patterns = { ...vowels, ...consonants, ...conjuncts, ...hybrids };

// Sort patterns by length (descending) to match longest first
const sortedPatterns = Object.keys(patterns).sort(
  (a, b) => b.length - a.length
);

function isConsonant(char: string): boolean {
  // Check if the character is a Bengali consonant
  return /[\u0995-\u09B9\u09CE\u09DC-\u09DF]/.test(char);
}

export function toBengali(text: string): string {
  let output = "";
  let i = 0;

  while (i < text.length) {
    let match = "";

    // Try to match longest pattern
    for (const pattern of sortedPatterns) {
      if (text.substring(i).startsWith(pattern)) {
        match = pattern;
        break;
      }
    }

    if (match) {
      // Check if it's a vowel
      if (vowels[match]) {
        // Determine if it should be a vowel sign or independent vowel
        const prevChar = output.length > 0 ? output[output.length - 1] : "";

        if (isConsonant(prevChar)) {
          output += vowelSigns[match];
        } else {
          output += vowels[match];
        }
      } else {
        // It's a consonant or conjunct
        output += patterns[match];
      }

      i += match.length;
    } else {
      // No match, keep original character
      output += text[i];
      i++;
    }
  }

  return output;
}

import type { SimilarityPair, MatchedSection } from './types';

function getWordShingles(text: string, n: number = 3): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
  const shingles = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    shingles.add(words.slice(i, i + n).join(' '));
  }
  return shingles;
}

function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 0;
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function findMatchedSections(text1: string, text2: string): MatchedSection[] {
  const sentences1 = text1.split(/(?<=[.!?])\s+/).filter(s => s.length > 30);
  const sentences2Set = new Map<string, number>();
  text2.split(/(?<=[.!?])\s+/).forEach((s, _i) => {
    if (s.length > 30) sentences2Set.set(s.toLowerCase().trim(), text2.indexOf(s));
  });

  const matches: MatchedSection[] = [];
  for (const s1 of sentences1) {
    const norm = s1.toLowerCase().trim();
    const pos2 = sentences2Set.get(norm);
    if (pos2 !== undefined) {
      matches.push({ text: s1, startIn1: text1.indexOf(s1), startIn2: pos2 });
    }
  }

  // Also find partial matches using word-window approach
  if (matches.length < 3) {
    const words1 = text1.split(/\s+/);
    const words2 = text2.toLowerCase();
    const windowSize = 12;
    for (let i = 0; i <= words1.length - windowSize; i += windowSize) {
      const phrase = words1.slice(i, i + windowSize).join(' ');
      const phraseNorm = phrase.toLowerCase();
      if (words2.includes(phraseNorm) && phrase.length > 40) {
        const startIn1 = text1.indexOf(phrase);
        const startIn2 = text2.toLowerCase().indexOf(phraseNorm);
        if (startIn1 !== -1 && startIn2 !== -1 && !matches.some(m => Math.abs(m.startIn1 - startIn1) < 50)) {
          matches.push({ text: phrase, startIn1, startIn2 });
        }
      }
    }
  }

  return matches.slice(0, 6);
}

export function computeSimilarity(
  submissions: { id: string; content: string }[]
): SimilarityPair[] {
  const pairs: SimilarityPair[] = [];
  const shingleCache = new Map<string, Set<string>>();

  for (const sub of submissions) {
    shingleCache.set(sub.id, getWordShingles(sub.content));
  }

  for (let i = 0; i < submissions.length; i++) {
    for (let j = i + 1; j < submissions.length; j++) {
      const s1 = submissions[i];
      const s2 = submissions[j];
      const shingles1 = shingleCache.get(s1.id)!;
      const shingles2 = shingleCache.get(s2.id)!;
      const similarity = jaccardSimilarity(shingles1, shingles2);
      const matchedSections = similarity > 0.1 ? findMatchedSections(s1.content, s2.content) : [];
      pairs.push({
        submission1Id: s1.id,
        submission2Id: s2.id,
        similarity: Math.min(similarity * 2.2, 0.99), // scale for display realism
        matchedSections,
      });
    }
  }

  return pairs;
}

export function getSimilarityColor(score: number): string {
  if (score >= 0.7) return 'text-red-600';
  if (score >= 0.5) return 'text-orange-500';
  if (score >= 0.3) return 'text-yellow-600';
  return 'text-green-600';
}

export function getSimilarityBg(score: number): string {
  if (score >= 0.7) return 'bg-red-100 text-red-700 border-red-200';
  if (score >= 0.5) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (score >= 0.3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-green-100 text-green-700 border-green-200';
}

export function getSimilarityLabel(score: number): string {
  if (score >= 0.7) return 'High Risk';
  if (score >= 0.5) return 'Medium Risk';
  if (score >= 0.3) return 'Low-Medium';
  return 'Low Risk';
}

export const ACADEMIC_YEAR_OPTIONS = ['2025/2026', '2026/2027'] as const;
export const ACADEMIC_TERM_OPTIONS = ['Term 1', 'Term 2'] as const;

export function normalizeAcademicTerm(term: string): string {
  const cleaned = term.trim().toUpperCase().replace(/[\s-]+/g, '_');
  const match = cleaned.match(/^TERM_?([1-2])$/);
  return match ? `TERM_${match[1]}` : term.trim();
}

export function formatAcademicTerm(term: string): string {
  const match = normalizeAcademicTerm(term).match(/^TERM_([1-2])$/);
  return match ? `Term ${match[1]}` : term.trim();
}
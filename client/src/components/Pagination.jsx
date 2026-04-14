export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>← Prev</button>
      {start > 1 && <button onClick={() => onPageChange(1)}>1</button>}
      {start > 2 && <span style={{ padding: '0 4px', color: 'var(--slate-400)' }}>…</span>}
      {pages.map((p) => (
        <button key={p} className={p === page ? 'active' : ''} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      {end < totalPages - 1 && <span style={{ padding: '0 4px', color: 'var(--slate-400)' }}>…</span>}
      {end < totalPages && <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next →</button>
    </div>
  );
}

import type { Assignment, Submission, SimilarityResult, User } from './types';

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str: string | number | undefined) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function exportToExcel(
  assignment: Assignment,
  submissions: Submission[],
  users: User[],
  similarityResult?: SimilarityResult
) {
  const safeFileName = assignment.title.replace(/[^a-z0-9]/gi, '_');

  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8">
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
  table { border-collapse: collapse; width: 100%; }
  th { background: #1e3a5f; color: white; padding: 6px 10px; border: 1px solid #ccc; font-size: 11pt; }
  td { padding: 5px 10px; border: 1px solid #ddd; }
  tr:nth-child(even) { background: #f8fafc; }
  .section-title { background: #374151; color: white; padding: 8px; font-weight: bold; margin-top: 20px; }
  .high { color: #dc2626; font-weight: bold; }
  .medium { color: #ea580c; font-weight: bold; }
  .low { color: #16a34a; }
</style>
</head><body>`;

  // Title
  html += `<h2 style="color:#1e3a5f">Grade Book — ${escapeHtml(assignment.title)}</h2>`;
  html += `<p>Subject: <strong>${assignment.subject}</strong> | Total Marks: <strong>${assignment.totalMarks}</strong> | Deadline: <strong>${assignment.deadline}</strong> | Generated: <strong>${new Date().toLocaleString()}</strong></p>`;

  // Grades Table
  html += `<h3 class="section-title">Grades Summary</h3><table>`;
  const gradeHeaders = ['#', 'Student Name', 'Email', 'Dept', 'File', 'Submitted', 'Grade', `%`, 'Max Similarity', 'Feedback'];
  html += `<tr>${gradeHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;
  submissions.forEach((sub, i) => {
    const u = users.find(u => u.id === sub.studentId);
    const pct = sub.grade !== undefined ? ((sub.grade / assignment.totalMarks) * 100).toFixed(1) : '';
    const sim = sub.maxSimilarity !== undefined ? (sub.maxSimilarity * 100).toFixed(1) + '%' : 'N/A';
    const simClass = (sub.maxSimilarity ?? 0) >= 0.7 ? 'high' : (sub.maxSimilarity ?? 0) >= 0.5 ? 'medium' : 'low';
    html += `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(u?.name)}</td>
      <td>${escapeHtml(u?.email)}</td>
      <td>${escapeHtml(u?.department)}</td>
      <td>${escapeHtml(sub.fileName)}</td>
      <td>${escapeHtml(new Date(sub.submittedAt).toLocaleString())}</td>
      <td><strong>${sub.grade !== undefined ? sub.grade + '/' + assignment.totalMarks : 'Not Graded'}</strong></td>
      <td>${pct ? pct + '%' : 'N/A'}</td>
      <td class="${simClass}">${escapeHtml(sim)}</td>
      <td>${escapeHtml(sub.feedback)}</td>
    </tr>`;
  });
  html += '</table>';

  // Rubric Table
  if (assignment.rubric.length > 0) {
    html += `<h3 class="section-title">Rubric Breakdown</h3><table>`;
    const rubricHeaders = ['Student', ...assignment.rubric.map(r => `${r.criterion} (/${r.maxMarks})`), 'Total'];
    html += `<tr>${rubricHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;
    submissions.forEach(sub => {
      const u = users.find(u => u.id === sub.studentId);
      html += `<tr><td>${escapeHtml(u?.name)}</td>`;
      assignment.rubric.forEach(r => {
        const rg = sub.rubricGrades?.find(rg => rg.criterionId === r.id);
        html += `<td>${rg ? rg.marks : 'N/A'}</td>`;
      });
      html += `<td><strong>${sub.grade !== undefined ? sub.grade : 'N/A'}</strong></td></tr>`;
    });
    html += '</table>';
  }

  // Similarity Table
  if (similarityResult && similarityResult.pairs.length > 0) {
    const sorted = [...similarityResult.pairs].sort((a, b) => b.similarity - a.similarity);
    html += `<h3 class="section-title">Similarity Report</h3><table>`;
    html += `<tr><th>Student 1</th><th>File 1</th><th>Student 2</th><th>File 2</th><th>Similarity %</th><th>Risk Level</th><th>Matched Sections</th></tr>`;
    sorted.forEach(pair => {
      const s1 = submissions.find(s => s.id === pair.submission1Id);
      const s2 = submissions.find(s => s.id === pair.submission2Id);
      const u1 = users.find(u => u.id === s1?.studentId);
      const u2 = users.find(u => u.id === s2?.studentId);
      const pct = (pair.similarity * 100).toFixed(1);
      const risk = pair.similarity >= 0.7 ? 'HIGH' : pair.similarity >= 0.5 ? 'MEDIUM' : pair.similarity >= 0.3 ? 'LOW-MED' : 'LOW';
      const cls = pair.similarity >= 0.7 ? 'high' : pair.similarity >= 0.5 ? 'medium' : 'low';
      html += `<tr>
        <td>${escapeHtml(u1?.name)}</td><td>${escapeHtml(s1?.fileName)}</td>
        <td>${escapeHtml(u2?.name)}</td><td>${escapeHtml(s2?.fileName)}</td>
        <td class="${cls}"><strong>${pct}%</strong></td>
        <td class="${cls}">${risk}</td>
        <td>${pair.matchedSections.length}</td>
      </tr>`;
    });
    html += '</table>';
  }

  html += '</body></html>';

  downloadBlob('\ufeff' + html, `${safeFileName}_results.xls`, 'application/vnd.ms-excel;charset=utf-8');
}

export function exportToPDF(
  assignment: Assignment,
  submissions: Submission[],
  users: User[],
  similarityResult?: SimilarityResult
) {
  const sortedPairs = similarityResult
    ? [...similarityResult.pairs].sort((a, b) => b.similarity - a.similarity)
    : [];

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  let html = `<!DOCTYPE html><html>
<head>
<meta charset="utf-8">
<title>Grade Book Report — ${escapeHtml(assignment.title)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11pt; padding: 30px; color: #1e293b; }
  .header { background: #1e3a5f; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
  .header h1 { font-size: 18pt; margin-bottom: 4px; }
  .header p { opacity: 0.8; font-size: 10pt; }
  .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
  .meta-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; text-align: center; }
  .meta-card .val { font-size: 16pt; font-weight: bold; color: #3b82f6; }
  .meta-card .lbl { font-size: 8pt; color: #94a3b8; margin-top: 2px; }
  h2 { font-size: 13pt; color: #1e3a5f; border-bottom: 2px solid #3b82f6; padding-bottom: 6px; margin: 20px 0 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 20px; }
  th { background: #1e3a5f; color: white; padding: 7px 8px; text-align: left; }
  td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
  tr:nth-child(even) td { background: #f8fafc; }
  .high { color: #dc2626; font-weight: bold; }
  .medium { color: #ea580c; font-weight: bold; }
  .lowmed { color: #ca8a04; }
  .low { color: #16a34a; }
  .good-grade { color: #16a34a; font-weight: bold; }
  .avg-grade { color: #ca8a04; font-weight: bold; }
  .bad-grade { color: #dc2626; font-weight: bold; }
  .page-break { page-break-before: always; padding-top: 20px; }
  @media print {
    body { padding: 15px; }
    .no-print { display: none; }
  }
</style>
</head><body>`;

  // Header
  const gradedSubs = submissions.filter(s => s.grade !== undefined);
  const avgGrade = gradedSubs.length > 0
    ? (gradedSubs.reduce((a, s) => a + (s.grade! / assignment.totalMarks) * 100, 0) / gradedSubs.length).toFixed(1)
    : 'N/A';
  const highRisk = submissions.filter(s => (s.maxSimilarity ?? 0) >= 0.7).length;

  html += `
  <div class="no-print" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;margin-bottom:16px;font-size:10pt;color:#0369a1">
    📄 <strong>Print this page</strong> (Ctrl+P / Cmd+P) to save as PDF, or use your browser's "Save as PDF" option.
    <button onclick="window.print()" style="margin-left:12px;background:#3b82f6;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:10pt">Print / Save as PDF</button>
  </div>
  <div class="header">
    <h1>📊 Grade Book — Assignment Report</h1>
    <p>${escapeHtml(assignment.title)} | ${assignment.subject} | Generated: ${new Date().toLocaleString()}</p>
  </div>

  <div class="meta-grid">
    <div class="meta-card"><div class="val">${submissions.length}</div><div class="lbl">Total Submissions</div></div>
    <div class="meta-card"><div class="val">${gradedSubs.length}</div><div class="lbl">Graded</div></div>
    <div class="meta-card"><div class="val">${avgGrade}${avgGrade !== 'N/A' ? '%' : ''}</div><div class="lbl">Average Grade</div></div>
    <div class="meta-card"><div class="val" style="color:${highRisk > 0 ? '#dc2626' : '#16a34a'}">${highRisk}</div><div class="lbl">High Similarity</div></div>
  </div>

  <h2>Grades Summary</h2>
  <table>
    <thead><tr><th>#</th><th>Student Name</th><th>Email</th><th>File</th><th>Submitted</th><th>Grade</th><th>%</th><th>Max Similarity</th></tr></thead>
    <tbody>`;

  submissions.forEach((sub, i) => {
    const u = users.find(u => u.id === sub.studentId);
    const pct = sub.grade !== undefined ? ((sub.grade / assignment.totalMarks) * 100) : null;
    const pctStr = pct !== null ? pct.toFixed(1) + '%' : 'N/A';
    const gradeClass = pct !== null ? (pct >= 75 ? 'good-grade' : pct >= 50 ? 'avg-grade' : 'bad-grade') : '';
    const sim = sub.maxSimilarity !== undefined ? (sub.maxSimilarity * 100).toFixed(1) + '%' : 'N/A';
    const simClass = (sub.maxSimilarity ?? 0) >= 0.7 ? 'high' : (sub.maxSimilarity ?? 0) >= 0.5 ? 'medium' : (sub.maxSimilarity ?? 0) >= 0.3 ? 'lowmed' : 'low';

    html += `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(u?.name)}</td>
      <td>${escapeHtml(u?.email)}</td>
      <td>${escapeHtml(sub.fileName)}</td>
      <td>${new Date(sub.submittedAt).toLocaleDateString()}</td>
      <td class="${gradeClass}">${sub.grade !== undefined ? sub.grade + '/' + assignment.totalMarks : '<em>Not graded</em>'}</td>
      <td class="${gradeClass}">${pctStr}</td>
      <td class="${simClass}">${escapeHtml(sim)}</td>
    </tr>`;
  });
  html += '</tbody></table>';

  // Rubric Breakdown
  if (assignment.rubric.length > 0 && gradedSubs.some(s => s.rubricGrades?.length)) {
    html += `<h2>Rubric Breakdown</h2><table>
    <thead><tr><th>Student</th>${assignment.rubric.map(r => `<th>${escapeHtml(r.criterion)}<br><small>/${r.maxMarks}</small></th>`).join('')}<th>Total</th></tr></thead><tbody>`;
    submissions.forEach(sub => {
      const u = users.find(u => u.id === sub.studentId);
      html += `<tr><td>${escapeHtml(u?.name)}</td>`;
      assignment.rubric.forEach(r => {
        const rg = sub.rubricGrades?.find(rg => rg.criterionId === r.id);
        html += `<td>${rg ? rg.marks : 'N/A'}</td>`;
      });
      html += `<td><strong>${sub.grade !== undefined ? sub.grade : 'N/A'}</strong></td></tr>`;
    });
    html += '</tbody></table>';
  }

  // Similarity Report
  if (sortedPairs.length > 0) {
    html += `<div class="page-break"><h2>Similarity Report</h2>
    <table><thead><tr><th>Student 1</th><th>File 1</th><th>Student 2</th><th>File 2</th><th>Similarity</th><th>Risk</th><th>Matched Sections</th></tr></thead><tbody>`;
    sortedPairs.forEach(pair => {
      const s1 = submissions.find(s => s.id === pair.submission1Id);
      const s2 = submissions.find(s => s.id === pair.submission2Id);
      const u1 = users.find(u => u.id === s1?.studentId);
      const u2 = users.find(u => u.id === s2?.studentId);
      const pct = (pair.similarity * 100).toFixed(1);
      const risk = pair.similarity >= 0.7 ? 'HIGH' : pair.similarity >= 0.5 ? 'MEDIUM' : pair.similarity >= 0.3 ? 'LOW-MED' : 'LOW';
      const cls = pair.similarity >= 0.7 ? 'high' : pair.similarity >= 0.5 ? 'medium' : pair.similarity >= 0.3 ? 'lowmed' : 'low';
      html += `<tr>
        <td>${escapeHtml(u1?.name)}</td><td>${escapeHtml(s1?.fileName)}</td>
        <td>${escapeHtml(u2?.name)}</td><td>${escapeHtml(s2?.fileName)}</td>
        <td class="${cls}"><strong>${pct}%</strong></td>
        <td class="${cls}">${risk}</td>
        <td>${pair.matchedSections.length}</td>
      </tr>`;
    });
    html += '</tbody></table></div>';

    // Matched Sections Detail
    const highPairs = sortedPairs.filter(p => p.similarity >= 0.5 && p.matchedSections.length > 0);
    if (highPairs.length > 0) {
      html += `<h2>Flagged Matched Sections</h2>`;
      highPairs.forEach(pair => {
        const s1 = submissions.find(s => s.id === pair.submission1Id);
        const s2 = submissions.find(s => s.id === pair.submission2Id);
        const u1 = users.find(u => u.id === s1?.studentId);
        const u2 = users.find(u => u.id === s2?.studentId);
        html += `<div style="margin-bottom:16px;border:1px solid #fca5a5;border-radius:6px;overflow:hidden">
          <div style="background:#fef2f2;padding:8px 12px;font-weight:bold;color:#dc2626;font-size:10pt">
            ⚠ ${escapeHtml(u1?.name)} ↔ ${escapeHtml(u2?.name)} — ${(pair.similarity * 100).toFixed(1)}% similarity
          </div>`;
        pair.matchedSections.slice(0, 3).forEach((sec, i) => {
          html += `<div style="padding:8px 12px;background:#fff5f5;border-top:1px solid #fecaca;font-size:9pt;font-family:monospace;color:#7f1d1d">
            <em>Match #${i + 1}:</em> ${escapeHtml(sec.text)}
          </div>`;
        });
        html += '</div>';
      });
    }
  }

  html += `<p style="margin-top:30px;font-size:9pt;color:#94a3b8;text-align:center">Generated by Grade Book on ${new Date().toLocaleString()}</p>`;
  html += '</body></html>';

  printWindow.document.write(html);
  printWindow.document.close();
}
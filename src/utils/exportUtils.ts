import { ResearchProject } from '../types';
import { SECTION_ORDER } from '../data/defaults';

export function compileProjectToMarkdown(project: ResearchProject): string {
  let output = `# ${project.title}\n\n`;
  output += `**Field:** ${project.fieldOfStudy} | **Department:** ${project.department || 'N/A'}\n`;
  output += `**Academic Level:** ${project.academicLevel} | **Document Type:** ${project.documentType}\n`;
  output += `**Keywords:** ${project.keywords.join(', ')}\n\n`;
  output += `---\n\n`;

  for (const key of SECTION_ORDER) {
    const sec = project.sections[key];
    if (sec && sec.content.trim()) {
      output += `${sec.content}\n\n---\n\n`;
    }
  }

  output += `\n*Draft compiled via ResearchAI Academic Assistant on ${new Date().toLocaleDateString()}*\n`;
  return output;
}

export function downloadPlainText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToWordDocument(project: ResearchProject) {
  const contentMarkdown = compileProjectToMarkdown(project);
  
  // Format into Word-compatible HTML with styling
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${project.title}</title>
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.8;
          color: #000000;
          margin: 1in;
        }
        h1 {
          font-size: 18pt;
          font-weight: bold;
          text-align: center;
          margin-bottom: 24pt;
        }
        h2 {
          font-size: 14pt;
          font-weight: bold;
          margin-top: 18pt;
          margin-bottom: 8pt;
          border-bottom: 1px solid #ddd;
          padding-bottom: 4pt;
        }
        h3 {
          font-size: 12pt;
          font-weight: bold;
          font-style: italic;
          margin-top: 14pt;
          margin-bottom: 6pt;
        }
        p {
          text-indent: 0.5in;
          margin-bottom: 8pt;
          text-align: justify;
        }
        .header-meta {
          text-align: center;
          font-size: 11pt;
          margin-bottom: 24pt;
          color: #333;
        }
        .references {
          padding-left: 0.5in;
          text-indent: -0.5in;
        }
      </style>
    </head>
    <body>
      <h1>${project.title}</h1>
      <div class="header-meta">
        <p><strong>Field:</strong> ${project.fieldOfStudy} | <strong>Level:</strong> ${project.academicLevel}</p>
        <p><strong>Keywords:</strong> ${project.keywords.join(', ')}</p>
      </div>
      <hr/>
      ${SECTION_ORDER.map(key => {
        const sec = project.sections[key];
        if (!sec || !sec.content.trim()) return '';
        // Convert simple markdown headings and paragraphs to basic HTML
        const safeText = sec.content
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/gim, '<em>$1</em>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br/>');
        return `<section><h2>${sec.title}</h2><p>${safeText}</p></section>`;
      }).join('')}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const sanitizedTitle = (project.title || 'Research_Paper')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 30);
  link.href = url;
  link.download = `${sanitizedTitle}_ResearchAI.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printToPdf() {
  window.print();
}

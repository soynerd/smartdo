export default function parseChecklist(markdown) {
  console.log("sreeApi->ParseAI", markdown);
  const sections = [];
  const lines = markdown.split("\n");

  let mainTitle = null;
  let currentSection = null;

  for (const line of lines) {
    // Match main title (starts with #)
    const mainTitleMatch = line.match(/^#\s+(.+)/);
    if (mainTitleMatch && !mainTitle) {
      mainTitle = {
        title: mainTitleMatch[1].trim(),
        items: []
      };
      continue;
    }

    // Match section headings like ## **Clothing**
    const headingMatch = line.match(/^(\#*\s*)?\*\*(.+?)\*\*\s*$/);
    const itemMatch = line.match(/^- \[ \] (.+)/);

    if (headingMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        title: headingMatch[2].trim(),
        items: []
      };
    } else if (itemMatch && currentSection) {
      currentSection.items.push({
        label: itemMatch[1].trim(),
        checked: false
      });
    }
  }

  if (currentSection) sections.push(currentSection);

  const result = mainTitle ? [mainTitle, ...sections] : sections;
  console.log("ParseAiResponse", result);
  return result;
}

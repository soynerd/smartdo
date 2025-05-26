export default function parseChecklist(markdown) {
  console.log("sreeApi->ParseAI",markdown);
  const sections = [];
  const lines = markdown.split("\n");

  let currentSection = null;

  for (const line of lines) {
    const headingMatch = line.match(/^\*\*(.+?)\*\*$/);
    const itemMatch = line.match(/^- (.+)/);

    if (headingMatch) {
      // New section starts
      if (currentSection) sections.push(currentSection);
      currentSection = {
        title: headingMatch[1],
        items: []
      };
    } else if (itemMatch && currentSection) {
      currentSection.items.push({
        label: itemMatch[1],
        checked: false
      });
    }
  }

  if (currentSection) sections.push(currentSection);
  console.log("ParseAiREsopnse", sections)
  return sections; //return object
  
}

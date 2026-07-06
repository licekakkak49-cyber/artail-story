const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

const startIndex = content.indexOf('const EditableImage =');
const endIndex = content.indexOf('const MainApp = () => {');

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex);
  const targetSection = content.substring(startIndex, endIndex);
  const after = content.substring(endIndex);

  // Replace font-helvetica with font-sans only in the backend section
  const updatedSection = targetSection.replace(/font-helvetica/g, 'font-sans');

  fs.writeFileSync('src/App.jsx', before + updatedSection + after);
  console.log('Successfully updated backend fonts!');
} else {
  console.log('Could not find start or end markers.');
}

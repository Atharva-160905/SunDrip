import fs from 'fs';
import path from 'path';

const directories = [
  path.join(process.cwd(), 'sundrip', 'src'),
  path.join(process.cwd(), 'admin', 'src'),
];

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach((file) => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const replaceUrls = () => {
  let modifiedFiles = 0;
  directories.forEach((dir) => {
    const files = walkSync(dir);
    
    files.forEach((file) => {
      let content = fs.readFileSync(file, 'utf8');
      let newContent = content;

      // 1. Single quotes
      newContent = newContent.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
      
      // 2. Double quotes
      newContent = newContent.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
      
      // 3. Backticks
      newContent = newContent.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');

      if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated: ${file}`);
        modifiedFiles++;
      }
    });
  });
  
  console.log(`Successfully refactored ${modifiedFiles} files.`);
};

replaceUrls();

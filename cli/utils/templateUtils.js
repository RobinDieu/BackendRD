const fs = require("fs");
const path = require("path");

function readAndWriteTemplate(templateName, destinationPath) {
  const templateDirPath = path.join(__dirname, "../templates");
  const templateContent = fs.readFileSync(
    path.join(templateDirPath, templateName),
    "utf8"
  );
  fs.writeFileSync(destinationPath, templateContent);
}

module.exports = {
  readAndWriteTemplate,
};

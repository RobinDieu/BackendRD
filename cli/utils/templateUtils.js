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

const postcssConfigContent = `
module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: {
        "mantine-breakpoint-xs": "36em",
        "mantine-breakpoint-sm": "48em",
        "mantine-breakpoint-md": "62em",
        "mantine-breakpoint-lg": "75em",
        "mantine-breakpoint-xl": "88em",
      },
    },
  },
};
`;

module.exports = {
  readAndWriteTemplate,
  postcssConfigContent,
};

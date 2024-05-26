const promptForSchemaFields = async () => {
  const inquirer = (await import("inquirer")).default;
  const fields = [];
  let addMore = true;

  while (addMore) {
    const { fieldName, fieldType, isRequired, addAnother } =
      await inquirer.prompt([
        {
          type: "input",
          name: "fieldName",
          message: "Enter field name:",
        },
        {
          type: "list",
          name: "fieldType",
          message: "Select field type:",
          choices: ["String", "Number", "Boolean", "Date", "Array", "Object"],
        },
        {
          type: "confirm",
          name: "isRequired",
          message: "Is this field required?",
          default: false,
        },
        {
          type: "confirm",
          name: "addAnother",
          message: "Do you want to add another field?",
          default: true,
        },
      ]);

    fields.push({
      fieldName,
      fieldType,
      isRequired,
    });

    addMore = addAnother;
  }

  return fields;
};

const formatSchemaDefinition = (fields) => {
  const schemaDefinition = {};
  fields.forEach(({ fieldName, fieldType, isRequired }) => {
    schemaDefinition[fieldName] = {
      type: fieldType,
      required: isRequired,
    };
  });
  return schemaDefinition;
};

const promptForRecordFields = async (schemaDefinition) => {
  const inquirer = (await import("inquirer")).default;
  const record = {};

  for (const fieldName in schemaDefinition) {
    const fieldType = schemaDefinition[fieldName].type;
    const isRequired = schemaDefinition[fieldName].required;

    const { fieldValue } = await inquirer.prompt([
      {
        type: "input",
        name: "fieldValue",
        message: `Enter value for ${fieldName} (${fieldType}):`,
        validate: (input) => {
          if (isRequired && !input) {
            return `${fieldName} is required`;
          }
          return true;
        },
      },
    ]);

    record[fieldName] = fieldValue;
  }

  return record;
};

module.exports = {
  promptForSchemaFields,
  formatSchemaDefinition,
  promptForRecordFields,
};

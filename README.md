# BackendRD

BackendRD is a flexible backend project that allows you to dynamically create database schemas and perform CRUD operations through both API routes and a CLI tool.

## Features

- Dynamic schema creation
- CRUD operations for dynamically created schemas
- User management (add, delete, update, list)
- Export and import schemas and records using JSON files
- Interactive CLI tool for managing the backend

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

### Running the Project

1. Start the server:

   ```bash
   npm start
   ```

2. Use the CLI tool:
   ```bash
   npm run cli
   ```

### CLI Commands

- **Create a new dynamic schema**:

  ```bash
  npm run cli create-schema <modelName>
  ```

- **Add a new record to a dynamic schema**:

  ```bash
  npm run cli add-record <modelName>
  ```

- **List all records of a dynamic schema**:

  ```bash
  npm run cli list-records <modelName>
  ```

- **Create schemas from a JSON file**:

  ```bash
  npm run cli create-schemas-from-file <filePath>
  ```

- **Add records from a JSON file to a dynamic schema**:

  ```bash
  npm run cli add-records-from-file <modelName> <filePath>
  ```

- **Add a new user**:

  ```bash
  npm run cli add-user
  ```

- **Delete a user by email**:

  ```bash
  npm run cli delete-user <email>
  ```

- **Update a user's email or password**:

  ```bash
  npm run cli update-user
  ```

- **List all users' emails**:
  ```bash
  npm run cli list-users
  ```

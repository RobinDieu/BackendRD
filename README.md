# BackendRD

BackendRD is a flexible backend project that allows you to dynamically create database schemas and perform CRUD operations through both API routes and a CLI tool.

## Features

- Dynamic schema creation
- CRUD operations for dynamically created schemas
- User management (add, delete, update, list)
- Export and import schemas and records using JSON files
- Interactive CLI tool for managing the backend
- Optional social media authentication (Google, Facebook, Microsoft, GitHub)
- Project setup with options for React, Electron, and Backend
- Automatic generation of SSL certificates for secure API communication

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/RobinDieu/BackendRD.git
   cd BackendRD
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   API_KEY=your_api_key
   SESSION_SECRET=your_session_secret

   # OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   MICROSOFT_CLIENT_ID=your_microsoft_client_id
   MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # CORS Origin
   CORS_ORIGIN=http://localhost:3000

   # Base URL
   BASE_URL=https://localhost:6969/api

   # Default Project Path
   DEFAULT_PROJECT_PATH=/path/to/default/directory
   ```

4. Generate SSL certificates:

   ```bash
   node scripts/generateCerts.js
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

### Using the CLI Tool

The CLI tool allows you to manage the backend and set up new projects with options for React, Electron, and Backend.

#### Starting a New Project

1. **Run the CLI Tool**:

   ```bash
   npm run cli start-project [options] <projectName>
   ```

   Options:

   - `-p, --path <path>`: Specify the full path of the directory where the project should be created.

   The CLI will prompt you to select the project types (React, Electron, Backend). Based on your selection, it will set up the appropriate project structure and install the necessary dependencies.

#### CLI Commands

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

- **Export all schemas to a JSON file**:

  ```bash
  npm run cli export-schemas <filePath>
  ```

- **Export all records of a model to a JSON file**:

  ```bash
  npm run cli export-records <modelName> <filePath>
  ```

- **Search and filter records of a dynamic schema**:

  ```bash
  npm run cli search-records <modelName>
  ```

- **Add a role to a user**:

  ```bash
  npm run cli add-role <email> <role>
  ```

- **Remove a role from a user**:

  ```bash
  npm run cli remove-role <email> <role>
  ```

- **Import users from a JSON file**:

  ```bash
  npm run cli import-users <filePath>
  ```

### Enabling Social Media Authentication

#### Prerequisites

- Register your application with the desired OAuth provider(s) to obtain the necessary credentials.

#### Environment Variables

Add the following environment variables to your `.env` file:

##### Google

```plaintext
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

##### Facebook

```plaintext
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

##### Microsoft

```plaintext
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

##### GitHub

```plaintext
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

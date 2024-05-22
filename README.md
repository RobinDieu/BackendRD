# BackendRD

BackendRD is a flexible backend project that allows you to dynamically create database schemas and perform CRUD operations through both API routes and a CLI tool.

## Features

- Dynamic schema creation
- CRUD operations for dynamically created schemas
- User management (add, delete, update, list)
- Export and import schemas and records using JSON files
- Interactive CLI tool for managing the backend
- Optional social media authentication (Google, Facebook, Microsoft, GitHub)

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
   ```

### Creating SSL Certificates

#### On Linux/Unix

1. **Install OpenSSL** (if not already installed):

   ```bash
   sudo apt update
   sudo apt install openssl
   ```

2. **Create a directory for the certificates**:

   ```bash
   mkdir ~/certs
   cd ~/certs
   ```

3. **Generate a private key**:

   ```bash
   openssl genrsa -out key.pem 2048
   ```

4. **Create a Certificate Signing Request (CSR)**:

   ```bash
   openssl req -new -key key.pem -out cert.csr
   ```

5. **Generate a self-signed certificate**:

   ```bash
   openssl x509 -req -days 365 -in cert.csr -signkey key.pem -out cert.pem
   ```

6. **Move the certificates to the appropriate directory**:
   ```bash
   sudo mkdir -p /etc/ssl/certs
   sudo cp key.pem cert.pem /etc/ssl/certs/
   ```

#### On Windows

1. **Install OpenSSL**:

   - Download and install OpenSSL from the [OpenSSL Windows binaries](https://slproweb.com/products/Win32OpenSSL.html).

2. **Open Command Prompt** and navigate to the OpenSSL installation directory:

   ```cmd
   cd C:\OpenSSL-Win64\bin
   ```

3. **Generate a private key**:

   ```cmd
   openssl genrsa -out key.pem 2048
   ```

4. **Create a Certificate Signing Request (CSR)**:

   ```cmd
   openssl req -new -key key.pem -out cert.csr
   ```

5. **Generate a self-signed certificate**:

   ```cmd
   openssl x509 -req -days 365 -in cert.csr -signkey key.pem -out cert.pem
   ```

6. **Move the certificates to the appropriate directory**:
   - Create a directory for the certificates (e.g., `C:\certs`) and move `key.pem` and `cert.pem` to this directory.

### Running the Project

1. **Create or provide your own SSL certificates**:

   - Create a `cert` folder in the root directory.
   - Add your `key.pem` and `cert.pem` files to the `cert` folder.
   - Alternatively, if you do not want to use HTTPS, you can comment out the HTTPS setup in `server.js`.

2. Start the server:

   ```bash
   npm start
   ```

3. Use the CLI tool:
   ```bash
   npm run cli
   ```

### Enabling Social Media Authentication

### Prerequisites

- Register your application with the desired OAuth provider(s) to obtain the necessary credentials.

### Environment Variables

Add the following environment variables to your `.env` file:

#### Google

```plaintext
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Facebook

```plaintext
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

#### Microsoft

```plaintext
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

#### GitHub

```plaintext
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
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

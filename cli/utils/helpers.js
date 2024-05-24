const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const runCommand = (command, options = {}) => {
  try {
    execSync(command, { stdio: "inherit", ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

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

const promptForUserDetails = async () => {
  const inquirer = (await import("inquirer")).default;
  const { email, password, roles } = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter user email:",
    },
    {
      type: "password",
      name: "password",
      message: "Enter user password:",
    },
    {
      type: "input",
      name: "roles",
      message: "Enter user roles (comma-separated):",
      filter: (input) =>
        input ? input.split(",").map((role) => role.trim()) : undefined,
    },
  ]);

  return { email, password, roles };
};

const promptForUserUpdateDetails = async () => {
  const inquirer = (await import("inquirer")).default;
  const { email, newEmail, newPassword } = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "Enter user email to update:",
    },
    {
      type: "input",
      name: "newEmail",
      message: "Enter new email (leave blank to keep current):",
    },
    {
      type: "password",
      name: "newPassword",
      message: "Enter new password (leave blank to keep current):",
    },
  ]);

  return { email, newEmail, newPassword };
};

const getProjectConfig = (projectTypes) => {
  const projectConfig = {
    react: false,
    electron: false,
    backend: false,
  };

  projectTypes.forEach((type) => {
    projectConfig[type.toLowerCase()] = true;
  });

  return projectConfig;
};

const createApiFiles = (apiPath) => {
  if (!fs.existsSync(apiPath)) {
    fs.mkdirSync(apiPath, { recursive: true });
  }

  const authAPIContent = `import axiosInstance from "./axiosInstance";

export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
  });
  return response.data;
};
`;

  const axiosInstanceContent = `import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/";

const API_KEY = process.env.REACT_APP_API_KEY || "YOU_SHOULD_CHANGE_THIS_TOO";

if (!API_URL || !API_KEY) {
  throw new Error(
    "API_URL or API_KEY is not defined. Please check your environment variables."
  );
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": API_KEY,
  },
});

export default axiosInstance;
`;

  const productAPIContent = `// Example API file for Products
import axiosInstance from "./axiosInstance";

export const getProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(\`/products/\${id}\`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(\`/products/\${id}\`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(\`/products/\${id}\`);
  return response.data;
};
`;

  fs.writeFileSync(path.join(apiPath, "authAPI.js"), authAPIContent);
  fs.writeFileSync(
    path.join(apiPath, "axiosInstance.js"),
    axiosInstanceContent
  );
  fs.writeFileSync(path.join(apiPath, "productAPI.js"), productAPIContent);

  console.log("API files created successfully.");
};

const createReactQueryFiles = (srcPath) => {
  const hooksPath = path.join(srcPath, "hooks");
  if (!fs.existsSync(hooksPath)) {
    fs.mkdirSync(hooksPath, { recursive: true });
  }

  const queryClientContent = `
  import { QueryClient } from "@tanstack/react-query";

  const queryClient = new QueryClient();

  export default queryClient;
`;

  const useAuthContent = `  
  import { useMutation } from "@tanstack/react-query";
  import { login, register } from "../api/authAPI";
  
  export const useLogin = () => {
    return useMutation({
      mutationFn: ({ email, password }) => {
        return login({ email, password });
      },
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
      },
    });
  };
  
  export const useRegister = () => {
    return useMutation({
      mutationFn: ({ email, password }) => {
        return register(email, password);
      },
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
      },
    });
  };  
  
`;

  fs.writeFileSync(path.join(srcPath, "queryClient.js"), queryClientContent);
  fs.writeFileSync(path.join(hooksPath, "useAuth.js"), useAuthContent);

  console.log("React Query files created successfully.");
};

const createOrUpdateIndexFile = (srcPath) => {
  const indexPath = path.join(srcPath, "index.js");
  const indexContent = `import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
`;

  // Check if index.js exists and overwrite it
  if (fs.existsSync(indexPath)) {
    console.log("index.js file already exists. Overwriting...");
  }

  fs.writeFileSync(indexPath, indexContent);

  console.log("index.js file created or updated successfully.");
};

const serverJsWithoutHttpsContent = `
const fs = require("fs");
const http = require("http");
const path = require("path");
const app = require("./app");
const logger = require("./config/logger");
const { connectDB, disconnectDB } = require("./config/db");
require("dotenv").config();

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app).listen(PORT, () => {
    logger.info(\`Server running on port \${PORT}\`);
  });

  // Handle graceful shutdown
  const shutdown = async () => {
    logger.info("Shutting down server...");
    await disconnectDB();
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
`;

function envBackupContent(projectName) {
  return `
MONGO_URI=mongodb://localhost:27017/${projectName}
JWT_SECRET=YOU_SHOULD_CHANGE_THIS
API_KEY=YOU_SHOULD_CHANGE_THIS_TOO
SESSION_SECRET=YOU_SHOULD_CHANGE_THIS_TOO_AS_WELL

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
BASE_URL=https://localhost:5000/api
`;
}

const envReactContent = String.raw`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_KEY=YOU_SHOULD_CHANGE_THIS_TOO
`;

const appJsContent = String.raw`
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
`;

const loginJsContent = String.raw`
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useLogin();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!/^\S+@\S+$/.test(formData.email)) {
      errors.email = "Invalid email";
    }
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      login(formData, {
        onSuccess: () => {
          navigate("/loggedIn");
        },
        onError: (validationErrors) => {
          setErrors(validationErrors);
        },
      });
    }
  };

  return (
    <div>
      <h1>Welcome back!</h1>
      <p>
        Do not have an account yet? <a href="/register">Create account</a>
      </p>

      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span>{errors.email}</span>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span>{errors.password}</span>}
          </div>
          <div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
          {errors && <span>{errors.message}</span>}
        </form>
      </div>
    </div>
  );
};

export default Login;

`;

const registerJsContent = String.raw`
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { mutate: register, isLoading } = useRegister();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!/^\S+@\S+$/.test(formData.email)) {
      errors.email = 'Invalid email';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      register(formData, {
        onSuccess: () => {
          navigate('/loggedIN');
        },
        onError: (validationErrors) => {
          setErrors(validationErrors);
        },
      });
    }
  };

  return (
    <div>
      <h1>Create an Account</h1>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span>{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span>{errors.password}</span>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

`;
module.exports = {
  runCommand,
  getProjectConfig,
  promptForSchemaFields,
  formatSchemaDefinition,
  promptForRecordFields,
  promptForUserDetails,
  promptForUserUpdateDetails,
  envBackupContent,
  envReactContent,
  appJsContent,
  loginJsContent,
  registerJsContent,
  serverJsWithoutHttpsContent,
  createApiFiles,
  createReactQueryFiles,
  createOrUpdateIndexFile,
};

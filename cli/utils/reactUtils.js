const fs = require("fs");
const path = require("path");

const createIndexFileContent = (projectConfig) => {
  let imports = `import React from "react";\nimport { createRoot } from "react-dom/client";\n`;
  let providers = "";
  let appWrapperStart = "";
  let appWrapperEnd = "";

  if (projectConfig.backend) {
    imports += `import { QueryClientProvider } from "@tanstack/react-query";\nimport queryClient from "./queryClient";\n`;
    providers += `  <QueryClientProvider client={queryClient}>\n`;
    appWrapperStart += `  `;
    appWrapperEnd = `  </QueryClientProvider>\n` + appWrapperEnd;
  }

  if (projectConfig.mantine) {
    imports += `import { MantineProvider } from "@mantine/core";\n`;
    providers += `  <MantineProvider withGlobalStyles withNormalizeCSS>\n`;
    appWrapperStart += `  `;
    appWrapperEnd = `  </MantineProvider>\n` + appWrapperEnd;
  }

  const content = `${imports}import App from "./App";\n\nconst container = document.getElementById("root");\nconst root = createRoot(container);\n\nroot.render(\n${providers}${appWrapperStart}<App />\n${appWrapperEnd});\n`;

  return content;
};

const createOrUpdateIndexFile = (srcPath, projectConfig) => {
  const indexPath = path.join(srcPath, "index.js");
  const indexContent = createIndexFileContent(projectConfig);

  fs.writeFileSync(indexPath, indexContent);
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
  createApiFiles,
  createReactQueryFiles,
  createOrUpdateIndexFile,
  appJsContent,
  loginJsContent,
  registerJsContent,
};

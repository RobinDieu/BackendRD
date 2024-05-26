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

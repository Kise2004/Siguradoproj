
      /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import bcrypt from "bcrypt";
import { User, sequelize } from "../models/userModel.js";
await sequelize.sync();

export const loginPage = (req, res) => {
  const error_msg = req.session.error_msg;
  const success_msg = req.session.success_msg;
  delete req.session.error_msg;
  delete req.session.success_msg;
  res.render("auth/login", { title: "Login", error_msg, success_msg });
};
export const registerPage = (req, res) => {
  const error_msg = req.session.error_msg;
  const success_msg = req.session.success_msg;
  delete req.session.error_msg;
  delete req.session.success_msg;
  res.render("auth/register", { title: "Register", error_msg, success_msg });
};
export const forgotPasswordPage = (req, res) => res.render("auth/forgotpassword", { title: "Forgot Password" });
export const dashboardPage = async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  
  const user = await User.findByPk(req.session.userId);
  
  if (!user) return res.redirect("/login");
  
  // Role-based dashboard routing
  let viewPath = "citizen/dashboard";
  
  if (user.role === 'responder') {
    viewPath = "responder/dashboard";
  } else if (user.role === 'mdrrmo') {
    viewPath = "mdrrmo/dashboard";
  } else if (user.role === 'official') {
    viewPath = "official/dashboard";
  }
  
  res.render(viewPath, { title: "Dashboard", user });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    req.session.error_msg = "Email not found. Please check your email or register for an account.";
    return res.redirect("/login");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    req.session.error_msg = "Incorrect password. Please try again.";
    return res.redirect("/login");
  }
  req.session.userId = user.id;
  req.session.success_msg = `Welcome back, ${user.name}! You have successfully logged in.`;
  res.redirect("/dashboard");
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, barangayId } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.session.error_msg = "Email already registered. Please login instead.";
      return res.redirect("/register");
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashed,
      role: role || 'citizen',
      barangayId: barangayId || null
    });
    
    req.session.userId = user.id;
    req.session.success_msg = "Registration successful! Welcome to SIGURADO.";
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Registration error:", error);
    req.session.error_msg = "Registration failed. Please try again.";
    res.redirect("/register");
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

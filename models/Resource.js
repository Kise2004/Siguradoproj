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

import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Resource = sequelize.define("resource", {
  barangayId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('vehicle', 'equipment', 'medical', 'shelter', 'food', 'other'), allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  unit: { type: DataTypes.STRING, allowNull: true },
  condition: { type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'), defaultValue: 'good' },
  status: { type: DataTypes.ENUM('available', 'in-use', 'maintenance', 'unavailable'), defaultValue: 'available' },
  description: { type: DataTypes.TEXT, allowNull: true }
});

export { sequelize };
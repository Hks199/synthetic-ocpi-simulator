# ✅ Use official Node.js image
FROM node:20-alpine

# ✅ Set working directory
WORKDIR /app

# ✅ Copy package files
COPY package*.json ./

# ✅ Install dependencies
RUN npm install

# ✅ Copy full project
COPY . .

# ✅ Expose your app port
EXPOSE 6002

# ✅ Start your app
CMD ["npm", "start"]

## 🐳 Run Using Docker

### 🔹 Step 1: Build Docker Image

Run this command inside the simulator folder:

```bash
docker build -t ocpi-simulator .

# step2: Run Container

docker run -p 6002:6002 ocpi-simulator





🛠️ Run Without Docker (Local)
Step 1: Install dependencies
npm install
Step 2: Start server
npm start
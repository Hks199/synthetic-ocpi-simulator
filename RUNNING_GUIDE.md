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

# docker run -p 6002:6002 ocpi-simulator

docker run -d -p 6002:6002 --name ocpi-simulator ocpi-simulator

# 1. Stop the container (Keep it in the background)  10ec6cc7a0c1 : container_id
docker stop 10ec6cc7a0c1   

#  Remove the container (Complete "Down")

docker rm -f e8cb643c71e5

#
docker stop ocpi-simulator
docker rm ocpi-simulator

docker build -t ocpi-simulator .

docker run -d -p 6002:6002 --name ocpi-simulator ocpi-simulator


# 🛠️ Run Without Docker (Local)
Step 1: Install dependencies
npm install
Step 2: Start server
npm start


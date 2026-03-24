# FROM node:18
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 6002
# CMD ["node", "src/server.js"]

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

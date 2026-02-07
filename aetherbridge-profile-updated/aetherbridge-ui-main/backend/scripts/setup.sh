#!/bin/bash

# =============================================================================
# AETHERBRIDGE BACKEND SETUP SCRIPT
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AetherBridge Backend Setup${NC}"
echo -e "${BLUE}============================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " input
        eval "$var_name=\${input:-$default}"
    else
        read -p "$prompt: " input
        eval "$var_name=\$input"
    fi
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${YELLOW}⚠️ Docker is not installed. Some features may not work${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Create necessary directories
echo -e "${YELLOW}📁 Creating directories...${NC}"
mkdir -p logs wallet config contracts scripts

# Copy environment template
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️ Setting up environment configuration...${NC}"
    cp config.env.example .env
    
    # Prompt for configuration values
    echo -e "${BLUE}Please provide the following configuration values:${NC}"
    
    prompt_input "Node environment" "development" NODE_ENV
    prompt_input "Server port" "8000" PORT
    prompt_input "Frontend URL" "http://localhost:3000" FRONTEND_URL
    
    # Database configuration
    echo -e "${BLUE}Database Configuration:${NC}"
    prompt_input "MongoDB URI" "mongodb://localhost:27017/aetherbridge" MONGODB_URI
    prompt_input "Redis URL" "redis://localhost:6379" REDIS_URL
    
    # Blockchain configuration
    echo -e "${BLUE}Blockchain Configuration:${NC}"
    prompt_input "Ethereum provider URL (Infura)" "https://sepolia.infura.io/v3/YOUR_PROJECT_ID" ETHEREUM_PROVIDER_URL
    prompt_input "Ethereum private key" "" ETHEREUM_PRIVATE_KEY
    
    # AI configuration
    echo -e "${BLUE}AI Configuration:${NC}"
    prompt_input "OpenAI API key" "" OPENAI_API_KEY
    
    # Email configuration
    echo -e "${BLUE}Email Configuration:${NC}"
    prompt_input "SMTP host" "smtp.gmail.com" SMTP_HOST
    prompt_input "SMTP user (email)" "" SMTP_USER
    prompt_input "SMTP password" "" SMTP_PASSWORD
    
    # Update .env file with user input
    sed -i "s/NODE_ENV=development/NODE_ENV=$NODE_ENV/" .env
    sed -i "s/PORT=8000/PORT=$PORT/" .env
    sed -i "s|FRONTEND_URL=http://localhost:3000|FRONTEND_URL=$FRONTEND_URL|" .env
    sed -i "s|MONGODB_URI=mongodb://localhost:27017/aetherbridge|MONGODB_URI=$MONGODB_URI|" .env
    sed -i "s|REDIS_URL=redis://localhost:6379|REDIS_URL=$REDIS_URL|" .env
    sed -i "s|ETHEREUM_PROVIDER_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID|ETHEREUM_PROVIDER_URL=$ETHEREUM_PROVIDER_URL|" .env
    
    if [ -n "$ETHEREUM_PRIVATE_KEY" ]; then
        sed -i "s/ETHEREUM_PRIVATE_KEY=your_ethereum_private_key/ETHEREUM_PRIVATE_KEY=$ETHEREUM_PRIVATE_KEY/" .env
    fi
    
    if [ -n "$OPENAI_API_KEY" ]; then
        sed -i "s/OPENAI_API_KEY=your_openai_api_key/OPENAI_API_KEY=$OPENAI_API_KEY/" .env
    fi
    
    sed -i "s/SMTP_HOST=smtp.gmail.com/SMTP_HOST=$SMTP_HOST/" .env
    
    if [ -n "$SMTP_USER" ]; then
        sed -i "s/SMTP_USER=your_email@gmail.com/SMTP_USER=$SMTP_USER/" .env
    fi
    
    if [ -n "$SMTP_PASSWORD" ]; then
        sed -i "s/SMTP_PASSWORD=your_app_password/SMTP_PASSWORD=$SMTP_PASSWORD/" .env
    fi
    
    echo -e "${GREEN}✅ Environment configuration completed${NC}"
else
    echo -e "${GREEN}✅ Environment file already exists${NC}"
fi

# Generate JWT secret
echo -e "${YELLOW}🔐 Generating JWT secret...${NC}"
JWT_SECRET=$(openssl rand -hex 32)
sed -i "s/JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random/JWT_SECRET=$JWT_SECRET/" .env
echo -e "${GREEN}✅ JWT secret generated${NC}"

# Setup database
echo -e "${YELLOW}🗄️ Setting up databases...${NC}"

# Check if MongoDB is running
if command_exists docker && docker ps | grep -q mongodb; then
    echo -e "${GREEN}✅ MongoDB container is running${NC}"
elif command_exists mongod; then
    echo -e "${GREEN}✅ MongoDB is installed locally${NC}"
else
    echo -e "${YELLOW}⚠️ MongoDB not found. Please install MongoDB or use Docker${NC}"
fi

# Check if Redis is running
if command_exists docker && docker ps | grep -q redis; then
    echo -e "${GREEN}✅ Redis container is running${NC}"
elif command_exists redis-server; then
    echo -e "${GREEN}✅ Redis is installed locally${NC}"
else
    echo -e "${YELLOW}⚠️ Redis not found. Please install Redis or use Docker${NC}"
fi

# Create database initialization scripts
echo -e "${YELLOW}📝 Creating database initialization scripts...${NC}"

cat > scripts/mongo-init.js << 'EOF'
// MongoDB initialization script
db = db.getSiblingDB('aetherbridge');

// Create collections
db.createCollection('users');
db.createCollection('credentials');
db.createCollection('courses');
db.createCollection('applications');
db.createCollection('events');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "walletAddress": 1 }, { unique: true });
db.credentials.createIndex({ "credentialId": 1 }, { unique: true });
db.credentials.createIndex({ "userId": 1 });
db.credentials.createIndex({ "blockchainHash": 1 }, { unique: true });

print('MongoDB initialized successfully');
EOF

cat > scripts/postgres-init.sql << 'EOF'
-- PostgreSQL initialization script
CREATE DATABASE IF NOT EXISTS aetherbridge;

\c aetherbridge;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    credential_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    credential_type VARCHAR(100) NOT NULL,
    blockchain_hash VARCHAR(255) UNIQUE,
    nft_token_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_blockchain_hash ON credentials(blockchain_hash);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EOF

echo -e "${GREEN}✅ Database initialization scripts created${NC}"

# Setup blockchain configuration
echo -e "${YELLOW}⛓️ Setting up blockchain configuration...${NC}"

# Create wallet directory
mkdir -p wallet

# Create sample network configuration for development
if [ ! -f config/network-config.json ]; then
    echo -e "${YELLOW}📄 Creating sample network configuration...${NC}"
    cat > config/network-config.json << 'EOF'
{
  "name": "aetherbridge-network",
  "version": "1.0.0",
  "client": {
    "organization": "Org1",
    "credentialStore": {
      "path": "./wallet",
      "cryptoStore": {
        "path": "./wallet"
      }
    }
  },
  "channels": {
    "mychannel": {
      "orderers": [
        "orderer.aetherbridge.com"
      ],
      "peers": {
        "peer0.org1.aetherbridge.com": {
          "endorsingPeer": true,
          "chaincodeQuery": true,
          "ledgerQuery": true,
          "eventSource": true
        }
      }
    }
  },
  "organizations": {
    "Org1": {
      "mspid": "Org1MSP",
      "peers": [
        "peer0.org1.aetherbridge.com"
      ],
      "certificateAuthorities": [
        "ca.org1.aetherbridge.com"
      ]
    }
  }
}
EOF
    echo -e "${GREEN}✅ Network configuration created${NC}"
fi

# Create deployment scripts
echo -e "${YELLOW}📜 Creating deployment scripts...${NC}"

# Make scripts executable
chmod +x scripts/deploy.sh
chmod +x scripts/setup.sh

echo -e "${GREEN}✅ Deployment scripts created and made executable${NC}"

# Create Docker Compose override for development
if [ ! -f docker-compose.override.yml ]; then
    echo -e "${YELLOW}🐳 Creating Docker Compose override...${NC}"
    cat > docker-compose.override.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: .
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
      - redis
      - ganache

  mongodb:
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
      - MONGO_INITDB_DATABASE=aetherbridge

  redis:
    ports:
      - "6379:6379"
    command: redis-server --requirepass password123

  ganache:
    ports:
      - "8545:8545"
    command: ganache-cli --host 0.0.0.0 --port 8545 --accounts 10 --deterministic

  ipfs:
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
EOF
    echo -e "${GREEN}✅ Docker Compose override created${NC}"
fi

# Create .gitignore
if [ ! -f .gitignore ]; then
    echo -e "${YELLOW}📝 Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Blockchain wallet and keys
wallet/
*.key
*.pem
*.crt

# Contract artifacts
contracts/artifacts/
contracts/cache/

# Database files
*.db
*.sqlite

# Docker volumes
docker-volumes/

# Kubernetes secrets
k8s/secrets.yaml
EOF
    echo -e "${GREEN}✅ .gitignore created${NC}"
fi

# Final setup instructions
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Review and update .env file with your actual values"
echo -e "2. Start the development environment:"
echo -e "   ${GREEN}docker-compose up -d${NC}"
echo -e "3. Or start manually:"
echo -e "   ${GREEN}npm run dev${NC}"
echo -e "4. Access the API at: ${GREEN}http://localhost:8000${NC}"
echo -e "5. Check health endpoint: ${GREEN}http://localhost:8000/health${NC}"
echo -e ""
echo -e "${YELLOW}For production deployment:${NC}"
echo -e "1. Review DEPLOYMENT.md for detailed instructions"
echo -e "2. Update Kubernetes configurations in k8s/ directory"
echo -e "3. Run deployment script: ${GREEN}./scripts/deploy.sh production${NC}"
echo -e ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "- API Documentation: http://localhost:8000/api/docs"
echo -e "- Deployment Guide: DEPLOYMENT.md"
echo -e "- Environment Config: config.env.example" 
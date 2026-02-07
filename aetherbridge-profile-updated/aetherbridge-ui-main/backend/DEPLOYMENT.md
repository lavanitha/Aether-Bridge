# AetherBridge Backend Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Blockchain Setup](#blockchain-setup)
5. [Local Development](#local-development)
6. [Production Deployment](#production-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

### Required Software
- Node.js 18+ 
- Docker & Docker Compose
- MongoDB 7.0+
- Redis 7.0+
- PostgreSQL 15+ (optional)
- Kubernetes cluster (for production)
- Helm 3.0+

### Required Accounts & Services
- Infura account (for Ethereum)
- OpenAI API key
- AWS account (for S3 storage)
- SendGrid account (for email)
- Domain name with SSL certificate

## Environment Setup

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd aetherbridge-ui-main/backend

# Install dependencies
npm install

# Copy environment template
cp config.env.example .env
```

### 2. Configure Environment Variables
Edit `.env` file with your actual values:

```bash
# Server Configuration
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://aetherbridge.com

# Database Configuration
MONGODB_URI=mongodb://username:password@your-mongodb-host:27017/aetherbridge
REDIS_URL=redis://username:password@your-redis-host:6379

# Blockchain Configuration
ETHEREUM_PROVIDER_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ETHEREUM_PRIVATE_KEY=your_ethereum_private_key
NFT_CONTRACT_ADDRESS=your_deployed_contract_address

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Storage Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=aetherbridge-storage
```

## Database Setup

### MongoDB Setup
```bash
# Using Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=aetherbridge \
  mongo:7.0

# Or using MongoDB Atlas
# Create cluster and get connection string
```

### Redis Setup
```bash
# Using Docker
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine redis-server --requirepass password123
```

### PostgreSQL Setup (Optional)
```bash
# Using Docker
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_DB=aetherbridge \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password123 \
  postgres:15-alpine
```

## Blockchain Setup

### 1. Deploy Ethereum Smart Contract

```bash
# Install Hardhat
npm install -g hardhat

# Initialize Hardhat project
npx hardhat init

# Deploy contract to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Hyperledger Fabric Setup

For production, you'll need to set up a Hyperledger Fabric network:

```bash
# Download Fabric binaries
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.0 1.4.4 0.4.18

# Generate crypto materials
./bin/cryptogen generate --config=./crypto-config.yaml

# Generate genesis block
./bin/configtxgen -profile AetherBridgeOrdererGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block

# Create channel configuration
./bin/configtxgen -profile AetherBridgeChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel
```

## Local Development

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Manual Setup
```bash
# Start MongoDB
mongod --dbpath /data/db

# Start Redis
redis-server

# Start the backend
npm run dev
```

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## Production Deployment

### 1. Docker Deployment

```bash
# Build production image
docker build -t aetherbridge-backend:latest .

# Run container
docker run -d \
  --name aetherbridge-backend \
  -p 8000:8000 \
  --env-file .env \
  aetherbridge-backend:latest
```

### 2. Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace aetherbridge

# Apply secrets (update with your values)
kubectl apply -f k8s/secrets.yaml

# Apply configmaps
kubectl apply -f k8s/configmaps.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployment status
kubectl get pods -n aetherbridge
kubectl get services -n aetherbridge
```

### 3. Using Helm

```bash
# Install Helm chart
helm install aetherbridge-backend ./helm \
  --namespace aetherbridge \
  --set image.tag=latest \
  --set replicas=3

# Upgrade deployment
helm upgrade aetherbridge-backend ./helm \
  --namespace aetherbridge \
  --set image.tag=v1.1.0
```

### 4. CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker image
      run: docker build -t aetherbridge-backend:${{ github.sha }} .
    
    - name: Push to registry
      run: |
        docker tag aetherbridge-backend:${{ github.sha }} ${{ secrets.REGISTRY }}/aetherbridge-backend:${{ github.sha }}
        docker push ${{ secrets.REGISTRY }}/aetherbridge-backend:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/aetherbridge-backend aetherbridge-backend=${{ secrets.REGISTRY }}/aetherbridge-backend:${{ github.sha }} -n aetherbridge
```

## Monitoring & Maintenance

### 1. Health Checks
```bash
# Check application health
curl https://api.aetherbridge.com/health

# Check database connections
curl https://api.aetherbridge.com/api/health/database

# Check blockchain status
curl https://api.aetherbridge.com/api/blockchain/status
```

### 2. Logs
```bash
# View application logs
kubectl logs -f deployment/aetherbridge-backend -n aetherbridge

# View logs from specific pod
kubectl logs -f pod/aetherbridge-backend-xyz123 -n aetherbridge
```

### 3. Monitoring Setup

Install Prometheus and Grafana:

```bash
# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
```

### 4. Backup Strategy

```bash
# MongoDB backup
mongodump --uri="mongodb://username:password@host:port/database" --out=/backup

# Redis backup
redis-cli BGSAVE

# PostgreSQL backup
pg_dump -h host -U username -d database > backup.sql
```

### 5. Scaling

```bash
# Scale horizontally
kubectl scale deployment aetherbridge-backend --replicas=5 -n aetherbridge

# Auto-scaling
kubectl autoscale deployment aetherbridge-backend --cpu-percent=70 --min=3 --max=10 -n aetherbridge
```

## Security Considerations

1. **Secrets Management**: Use Kubernetes secrets or external secret managers
2. **Network Security**: Implement proper firewall rules and network policies
3. **SSL/TLS**: Ensure all communications are encrypted
4. **Access Control**: Implement proper RBAC and authentication
5. **Regular Updates**: Keep dependencies and base images updated

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check connection strings
   - Verify network connectivity
   - Check authentication credentials

2. **Blockchain Connection Issues**
   - Verify provider URLs
   - Check private keys
   - Ensure sufficient gas fees

3. **Memory Issues**
   - Monitor memory usage
   - Adjust resource limits
   - Implement proper garbage collection

### Support

For issues and support:
- Check logs: `kubectl logs -n aetherbridge`
- Monitor metrics: Grafana dashboard
- Review documentation: API docs at `/api/docs`
- Contact: support@aetherbridge.com 
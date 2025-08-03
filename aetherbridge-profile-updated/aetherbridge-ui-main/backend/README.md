# AetherBridge Backend

A comprehensive backend API for the AetherBridge Academic Mobility Platform, featuring blockchain integration, AI-powered services, and credential management.

## 🚀 Features

- **Blockchain Integration**: Hyperledger Fabric + Ethereum for credential verification and NFT minting
- **AI Services**: OpenAI integration for intelligent course matching and assessment
- **Database Support**: MongoDB + PostgreSQL + Redis for scalable data storage
- **Authentication**: JWT-based authentication with Firebase integration
- **File Storage**: AWS S3 and IPFS support for document storage
- **Email Services**: SMTP and SendGrid integration
- **Real-time Features**: WebSocket support for live updates
- **Security**: Rate limiting, CORS, helmet, and comprehensive security measures
- **Monitoring**: Health checks, logging, and metrics collection
- **Containerization**: Docker and Kubernetes support

## 📋 Prerequisites

- Node.js 18+
- MongoDB 7.0+
- Redis 7.0+
- PostgreSQL 15+ (optional)
- Docker & Docker Compose
- Kubernetes cluster (for production)

## 🛠️ Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd aetherbridge-ui-main/backend

# Run automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp config.env.example .env
# Edit .env with your actual values
```

### 3. Start Development Environment

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or start manually
npm install
npm run dev
```

### 4. Verify Installation

```bash
# Check health endpoint
curl http://localhost:8000/health

# Check API documentation
open http://localhost:8000/api/docs
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Blockchain    │
│   (React)       │◄──►│   (Express)     │◄──►│   (Fabric/ETH)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Redis Cache   │    │   AI Services   │
│   (Primary DB)  │    │   (Sessions)    │    │   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── network-config.json # Hyperledger Fabric config
│   └── ...
├── contracts/              # Smart contracts
│   └── AetherBridgeNFT.sol # Ethereum NFT contract
├── k8s/                    # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── secrets.yaml
│   └── configmaps.yaml
├── middleware/             # Express middleware
│   ├── auth.js
│   └── errorHandler.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── user.js
│   ├── credentials.js
│   └── ...
├── services/               # Business logic
│   ├── database.js
│   ├── blockchain.js
│   ├── ai.js
│   └── email.js
├── scripts/                # Utility scripts
│   ├── setup.sh
│   ├── deploy.sh
│   └── ...
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Local development
├── package.json
└── server.js              # Main application
```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```bash
# Server
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://aetherbridge.com

# Database
MONGODB_URI=mongodb://username:password@host:port/database
REDIS_URL=redis://username:password@host:port

# Blockchain
ETHEREUM_PROVIDER_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
ETHEREUM_PRIVATE_KEY=your_private_key
NFT_CONTRACT_ADDRESS=your_contract_address

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=aetherbridge-storage
```

## 🚀 Deployment

### Local Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Production Deployment

#### Using Docker

```bash
# Build image
docker build -t aetherbridge-backend:latest .

# Run container
docker run -d \
  --name aetherbridge-backend \
  -p 8000:8000 \
  --env-file .env \
  aetherbridge-backend:latest
```

#### Using Kubernetes

```bash
# Create namespace
kubectl create namespace aetherbridge

# Apply configurations
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmaps.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods -n aetherbridge
```

#### Using Helm

```bash
# Install chart
helm install aetherbridge-backend ./helm \
  --namespace aetherbridge \
  --set image.tag=latest \
  --set replicas=3
```

### Automated Deployment

```bash
# Run deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/credentials` - Get user credentials

### Credentials
- `POST /api/credentials/issue` - Issue new credential
- `GET /api/credentials/:id` - Get credential details
- `POST /api/credentials/verify` - Verify credential
- `POST /api/credentials/revoke` - Revoke credential

### Blockchain
- `GET /api/blockchain/status` - Get blockchain status
- `POST /api/blockchain/mint-nft` - Mint credential as NFT
- `GET /api/blockchain/analytics` - Get blockchain analytics

### Courses
- `GET /api/courses` - Get available courses
- `POST /api/courses/search` - Search courses
- `GET /api/courses/:id` - Get course details

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user applications
- `PUT /api/applications/:id` - Update application

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse with request limiting
- **CORS Protection**: Configured cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Cross-site scripting prevention

## 📊 Monitoring

### Health Checks

```bash
# Application health
curl https://api.aetherbridge.com/health

# Database health
curl https://api.aetherbridge.com/api/health/database

# Blockchain status
curl https://api.aetherbridge.com/api/blockchain/status
```

### Logs

```bash
# View application logs
kubectl logs -f deployment/aetherbridge-backend -n aetherbridge

# View specific pod logs
kubectl logs -f pod/aetherbridge-backend-xyz123 -n aetherbridge
```

### Metrics

- Prometheus metrics available at `/metrics`
- Grafana dashboard for visualization
- Custom business metrics collection

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 🔧 Development

### Adding New Routes

1. Create route file in `routes/` directory
2. Add route to `server.js`
3. Implement middleware and validation
4. Add tests

### Adding New Services

1. Create service file in `services/` directory
2. Implement business logic
3. Add error handling
4. Add tests

### Database Migrations

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📚 Documentation

- [API Documentation](http://localhost:8000/api/docs)
- [Deployment Guide](DEPLOYMENT.md)
- [Environment Configuration](config.env.example)
- [Blockchain Integration](./docs/blockchain.md)
- [Database Schema](./docs/database.md)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/aetherbridge/backend/issues)
- **Documentation**: [API Docs](http://localhost:8000/api/docs)
- **Email**: support@aetherbridge.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Hyperledger Fabric community
- Ethereum Foundation
- OpenAI for AI services
- MongoDB and Redis communities 
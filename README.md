# AetherBridge - Academic Mobility Platform

A comprehensive blockchain-powered academic mobility platform that enables seamless credit transfer, credential verification, and global educational pathways using AI and Hyperledger Fabric.

##  Features

### Student Section
- **Dashboard**: Academic passport summary, verified credits, pathway suggestions, and recent activity
- **Application**: Upload transcripts and request credit equivalency with status tracking
- **Equivalency Finder**: AI-powered course comparison with confidence scores and bridging recommendations
- **Credential Viewer**: Blockchain-verified credentials with NFT minting capabilities
- **Mint NFT**: Convert credentials to NFTs with blockchain proof

### Blockchain Section
- **Connect Wallet**: MetaMask integration with DID support
- **View Credentials**: Public credential lookup and verification
- **Credential Verification**: Institution/employer verification mode

### Admin Section
- **App Review**: Student application management and approval workflow
- **Verify Credentials**: Credential verification and blockchain anchoring

### Main Section
- **Courses**: Global course catalog with equivalency metadata
- **Mentorship**: Expert mentor matching and session booking
- **Events**: Academic events with registration and management
- **Skill Assessment**: AI-powered skill evaluation and recommendations

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Query** for state management
- **React Router** for navigation
- **Firebase** for authentication

### Backend
- **Node.js** with Express
- **MongoDB/PostgreSQL** for data storage
- **Hyperledger Fabric** for blockchain operations
- **Ethereum** for NFT minting
- **OpenAI GPT-4** for AI analysis
- **LangChain** for vector search
- **Firebase Admin** for authentication

### Blockchain
- **Hyperledger Fabric** for credential management
- **Ethereum** for NFT functionality
- **DID** (Decentralized Identifiers) for identity management
- **IPFS** for decentralized storage

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB or PostgreSQL
- Firebase project
- OpenAI API key
- Ethereum wallet (for NFT features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aetherbridge-ui-main
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

Create `.env` files in both root and backend directories:

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

#### Backend (.env)
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/aetherbridge
POSTGRES_URI=postgresql://username:password@localhost:5432/aetherbridge

# Firebase Admin
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Blockchain
ETHEREUM_PROVIDER_URL=https://sepolia.infura.io/v3/your_project_id
NFT_CONTRACT_ADDRESS=your_nft_contract_address

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket
```

### 4. Start Development Servers

```bash
# Start frontend (in root directory)
npm run dev

# Start backend (in backend directory)
cd backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Health Check: http://localhost:8000/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user applications
- `PUT /api/applications/:id/status` - Update application status

### Equivalency
- `POST /api/equivalency/find` - Find course equivalencies

### Credentials
- `GET /api/credentials` - Get user credentials
- `POST /api/credentials/:id/verify` - Verify credential
- `POST /api/credentials/:id/mint-nft` - Mint credential as NFT

### Blockchain
- `GET /api/blockchain/status` - Get blockchain status

## 🔧 Development

### Project Structure

```
aetherbridge-ui-main/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── assets/             # Static assets
│   └── App.tsx             # Main app component
├── backend/
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   └── server.js           # Main server file
├── public/                 # Public assets
└── package.json
```

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
```

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
npm run test
```

## 🚀 Deployment

### Frontend Deployment

```bash
# Build the application
npm run build

# Deploy to your preferred platform (Vercel, Netlify, etc.)
```

### Backend Deployment

```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Start the server
cd backend
npm start
```

## 🔐 Security Features

- JWT token authentication
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection
- Helmet.js security headers

## 🌐 Blockchain Integration

### Hyperledger Fabric
- Credential issuance and verification
- Immutable audit trail
- Smart contract execution
- Network consensus

### Ethereum
- NFT minting for credentials
- Smart contract integration
- Wallet connectivity
- Transaction verification

## 🤖 AI Features

### Course Equivalency Analysis
- Vector similarity search
- Natural language processing
- Confidence scoring
- Bridging course recommendations

### Skill Assessment
- Adaptive testing
- Performance analysis
- Personalized recommendations
- Learning path optimization

## 📊 Database Schema

### Users
```javascript
{
  id: String,
  email: String,
  name: String,
  role: String,
  did: String,
  walletAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Credentials
```javascript
{
  id: String,
  userId: String,
  type: String,
  title: String,
  issuer: String,
  issueDate: Date,
  blockchainHash: String,
  transactionHash: String,
  status: String,
  nftTokenId: String
}
```

### Applications
```javascript
{
  id: String,
  userId: String,
  status: String,
  targetInstitution: String,
  targetProgram: String,
  transcripts: [String],
  equivalencyResults: [Object],
  submittedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@aetherbridge.com or join our Slack channel.

## 🙏 Acknowledgments

- Hyperledger Fabric community
- OpenAI for AI capabilities
- React and Vite teams
- All contributors and supporters

---

**AetherBridge** - Bridging the gap in global academic mobility through blockchain and AI.

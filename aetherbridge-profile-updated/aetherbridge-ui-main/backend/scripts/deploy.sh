#!/bin/bash

# =============================================================================
# AETHERBRIDGE BACKEND DEPLOYMENT SCRIPT
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"your-registry.com"}
IMAGE_NAME=${DOCKER_IMAGE_NAME:-"aetherbridge-backend"}
IMAGE_TAG=${DOCKER_IMAGE_TAG:-"latest"}
NAMESPACE=${K8S_NAMESPACE:-"aetherbridge"}

echo -e "${BLUE}🚀 Starting AetherBridge Backend Deployment...${NC}"
echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}Image: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command_exists kubectl; then
    echo -e "${RED}❌ kubectl is not installed${NC}"
    exit 1
fi

if ! command_exists helm; then
    echo -e "${RED}❌ Helm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Build Docker image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .
docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}-${ENVIRONMENT} .

# Push to registry
echo -e "${YELLOW}📤 Pushing image to registry...${NC}"
docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}-${ENVIRONMENT}

# Create namespace if it doesn't exist
echo -e "${YELLOW}📁 Creating namespace...${NC}"
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# Apply Kubernetes secrets
echo -e "${YELLOW}🔐 Applying secrets...${NC}"
kubectl apply -f k8s/secrets.yaml -n ${NAMESPACE}

# Apply Kubernetes configmaps
echo -e "${YELLOW}⚙️ Applying configmaps...${NC}"
kubectl apply -f k8s/configmaps.yaml -n ${NAMESPACE}

# Deploy using Helm
echo -e "${YELLOW}📦 Deploying with Helm...${NC}"
helm upgrade --install aetherbridge-backend ./helm \
    --namespace ${NAMESPACE} \
    --set image.repository=${DOCKER_REGISTRY}/${IMAGE_NAME} \
    --set image.tag=${IMAGE_TAG}-${ENVIRONMENT} \
    --set environment=${ENVIRONMENT} \
    --set replicas=${K8S_REPLICAS:-3} \
    --wait --timeout=10m

# Wait for deployment to be ready
echo -e "${YELLOW}⏳ Waiting for deployment to be ready...${NC}"
kubectl rollout status deployment/aetherbridge-backend -n ${NAMESPACE} --timeout=300s

# Apply ingress
echo -e "${YELLOW}🌐 Applying ingress...${NC}"
kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}

# Health check
echo -e "${YELLOW}🏥 Performing health check...${NC}"
sleep 30

HEALTH_CHECK_URL="https://${LOAD_BALANCER_HOSTNAME:-api.aetherbridge.com}/health"
for i in {1..10}; do
    if curl -f -s ${HEALTH_CHECK_URL} > /dev/null; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        break
    else
        echo -e "${YELLOW}⏳ Health check attempt ${i}/10...${NC}"
        sleep 10
    fi
done

# Show deployment status
echo -e "${YELLOW}📊 Deployment status:${NC}"
kubectl get pods -n ${NAMESPACE}
kubectl get services -n ${NAMESPACE}
kubectl get ingress -n ${NAMESPACE}

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 API URL: https://${LOAD_BALANCER_HOSTNAME:-api.aetherbridge.com}${NC}"
echo -e "${BLUE}📚 API Documentation: https://${LOAD_BALANCER_HOSTNAME:-api.aetherbridge.com}/api/docs${NC}" 
#!/bin/bash

# EC2 Auto-Build Script for EcoMetrics
# Run this script on your EC2 instance to build the project

set -e  # Exit on any error

echo "🚀 Starting EcoMetrics Build Process on EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
yarn install

echo -e "${YELLOW}🔨 Running build...${NC}"
yarn build

# Verify build success
if [ -d "out" ] && [ -f "out/input.html" ]; then
    echo -e "${GREEN}✅ Build successful! 'out' folder created.${NC}"
    
    # Show build info
    echo -e "${YELLOW}📊 Build Information:${NC}"
    echo "   • Total files: $(find out/ -type f | wc -l)"
    echo "   • Folder size: $(du -sh out/ | cut -f1)"
    echo "   • input.html size: $(ls -lh out/input.html | awk '{print $5}')"
    
    echo -e "${GREEN}🎉 Your application is ready for static hosting!${NC}"
    echo -e "${YELLOW}   Next steps:${NC}"
    echo "   1. Configure your web server to serve from the 'out' directory"
    echo "   2. Point your domain to the EC2 instance"
    echo "   3. Your CRUD functionality will work with localStorage fallback"
    
else
    echo -e "${RED}❌ Build failed! 'out' folder or input.html not found.${NC}"
    exit 1
fi
#!/bin/bash
# 🎵 Neo Audio Player - GitHub Pages Deploy Script
# Usage: GITHUB_TOKEN="ghp_xxxxx" ./deploy.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🎵 Neo Audio Player - Deploy to GitHub Pages${NC}"
echo ""

# Check token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ GITHUB_TOKEN not set${NC}"
    echo ""
    echo "Get a token at: https://github.com/settings/tokens"
    echo "Then run:"
    echo "  export GITHUB_TOKEN=\"ghp_your_token\""
    echo "  ./deploy.sh"
    exit 1
fi

OWNER="jtjustinktaylor-lgtm"
REPO="neo-audio-player"
API="https://api.github.com"

echo -e "${GREEN}✓ Token found${NC}"

# Create repo if it doesn't exist
echo -e "${BLUE}📦 Creating repository...${NC}"
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "$API/user/repos" \
  -d "{\"name\":\"$REPO\",\"description\":\"🎵 Neo Audio Player - Personal music studio\",\"auto_init\":true,\"private\":false}" > /dev/null 2>&1 || true

echo -e "${GREEN}✓ Repository ready${NC}"

# Function to push a file
push_file() {
    local file_path=$1
    local repo_path=$2
    local message=$3
    
    echo -e "${BLUE}📤 Pushing $repo_path...${NC}"
    
    # Get SHA if file exists
    SHA=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
      "$API/repos/$OWNER/$REPO/contents/$repo_path" | grep -o '"sha":"[^"]*"' | cut -d'"' -f4)
    
    # Encode file
    CONTENT=$(base64 -w 0 "$file_path" 2>/dev/null || base64 -i "$file_path")
    
    # Build JSON
    if [ -n "$SHA" ]; then
        JSON="{\"message\":\"$message\",\"content\":\"$CONTENT\",\"sha\":\"$SHA\"}"
    else
        JSON="{\"message\":\"$message\",\"content\":\"$CONTENT\"}"
    fi
    
    # Push
    RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      "$API/repos/$OWNER/$REPO/contents/$repo_path" \
      -d "$JSON")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
        echo -e "${GREEN}✓ $repo_path pushed${NC}"
    else
        echo -e "${RED}✗ Failed to push $repo_path (HTTP $HTTP_CODE)${NC}"
        echo "$RESPONSE" | head -5
    fi
}

# Push files
push_file "index.html" "index.html" "🎵 Update Neo Audio Player"
push_file "manifest.json" "manifest.json" "📱 Add PWA manifest"
push_file "README.md" "README.md" "📚 Add documentation"

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Go to: https://github.com/$OWNER/$REPO/settings/pages"
echo "2. Source: Deploy from a branch"
echo "3. Branch: main / root"
echo "4. Save"
echo ""
echo -e "${BLUE}🌐 Your player will be at:${NC}"
echo "   https://$OWNER.github.io/$REPO"
echo ""
echo -e "${BLUE}📱 To install as app:${NC}"
echo "   Open the URL on your phone"
echo "   Tap 'Add to Home Screen'"
echo ""
echo -e "${GREEN}🎵 Enjoy your music!${NC}"

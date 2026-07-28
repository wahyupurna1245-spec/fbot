FROM node:20-bookworm

WORKDIR /app

# Install tools media
RUN apt-get update && apt-get install -y \
    ffmpeg \
    imagemagick \
    python3 \
    python3-pip \
    wget \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install yt-dlp --break-system-packages \
    && yt-dlp --version

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy source code
COPY . .

# Start bot
CMD ["node", "index.js"]
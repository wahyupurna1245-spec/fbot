FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    python3 \
    python3-pip \
    wget \
    curl \
    git \
    unzip \
    zip \
    && rm -rf /var/lib/apt/lists/*

# Install Deno untuk yt-dlp
RUN curl -fsSL https://deno.land/install.sh | sh

ENV PATH="/root/.deno/bin:$PATH"


# Install yt-dlp
RUN pip3 install -U yt-dlp --break-system-packages \
    && yt-dlp --version


COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]
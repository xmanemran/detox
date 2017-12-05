FROM butomo1989/docker-android-arm-7.1.1

# Install node 8.X
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash && \
    apt-get install -y nodejs && \
    apt-get remove -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /detox
COPY ./ ./

RUN npm install && \
    __DETOX_DEV=true npx lerna bootstrap && \
    npm run postinstall --prefix detox

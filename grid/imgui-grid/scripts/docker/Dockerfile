# 
FROM ubuntu:24.04

# ，
ENV GIT_SSL_NO_VERIFY=1
ENV DEBIAN_FRONTEND=noninteractive

#  apt  HTTPS 
RUN echo 'Acquire::https::Verify-Peer "false";' > /etc/apt/apt.conf.d/99verify-peer.conf && \
    echo 'Acquire::https::Verify-Host "false";' >> /etc/apt/apt.conf.d/99verify-peer.conf

# （）
COPY ./sources.list /etc/apt/sources.list

# （）
RUN apt-get clean && \
    apt-get update && \
    apt-get install -y ca-certificates && \
    update-ca-certificates

# apt
RUN apt-get update -y && apt-get upgrade -y

# 
RUN apt-get install -y python3 python3-pip cmake git-core

# 
WORKDIR /emscripten

# Emscripten SDK
RUN git clone https://github.com/emscripten-core/emsdk.git .

# sdk
RUN ./emsdk install latest

# sdk
RUN ./emsdk activate latest
RUN chmod +x ./emsdk_env.sh && ./emsdk_env.sh
# 
ENV PATH="/emscripten:/emscripten/upstream/emscripten:/emscripten/node/16.20.0_64bit/bin:${PATH}"

# Emscripten
RUN emcc -v

#RUN wget -O /tmp/boost-headers-1.83.0.zip  \
#    && unzip /tmp/boost-headers-1.83.0.zip -d /emscripten/upstream/emscripten/system/include/
COPY ./demo /emscripten/
RUN emcc /emscripten/hello_world.c -s USE_BOOST_HEADERS=1

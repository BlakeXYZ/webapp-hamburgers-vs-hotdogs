# ================================== BUILDER STAGE ===================================
ARG INSTALL_PYTHON_VERSION=${INSTALL_PYTHON_VERSION:-PYTHON_VERSION_NOT_SET}
ARG INSTALL_NODE_VERSION=${INSTALL_NODE_VERSION:-NODE_VERSION_NOT_SET}

ARG INSTALL_PYTHON_VERSION=3.12
ARG INSTALL_NODE_VERSION=20

FROM node:${INSTALL_NODE_VERSION}-bullseye-slim AS node
FROM python:${INSTALL_PYTHON_VERSION}-slim-bullseye AS builder

WORKDIR /app

COPY --from=node /usr/local/bin/ /usr/local/bin/
COPY --from=node /usr/lib/ /usr/lib/
# See https://github.com/moby/moby/issues/37965
RUN true
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY requirements requirements
RUN pip install --no-cache -r requirements/prod.txt

COPY package.json ./
RUN npm install


COPY webpack.config.js autoapp.py ./
COPY webapp_hamburg_vs_hotdog webapp_hamburg_vs_hotdog
COPY assets assets
COPY .env .env
RUN npm run-script build

# ================================= PRODUCTION STAGE =================================
# docker build --target production -t <image-name> .
FROM python:${INSTALL_PYTHON_VERSION}-slim-bullseye AS production

LABEL org.opencontainers.image.source=https://github.com/blakexyz/webapp-hamburgers-vs-hotdogs

WORKDIR /app

# installing postgresql-client in Dockerfile to use pg_isready to check if the database is ready inside supervisord_entrypoint.sh
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

RUN useradd -m sid
RUN chown -R sid:sid /app
USER sid
ENV PATH="/home/sid/.local/bin:${PATH}"

COPY --from=builder --chown=sid:sid /app/webapp_hamburg_vs_hotdog/static /app/webapp_hamburg_vs_hotdog/static
COPY requirements requirements
RUN pip install --no-cache --user -r requirements/prod.txt

COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY supervisord_programs /etc/supervisor/conf.d

COPY . .
COPY migrations migrations

EXPOSE 5000

ENTRYPOINT ["/bin/bash", "shell_scripts/supervisord_entrypoint.sh"]
CMD ["-c", "/etc/supervisor/supervisord.conf"]

#TODO: Figure out reintroduction of Development Section
# ================================= DEVELOPMENT STAGE ================================
# docker build --target development -t <image-name> .
FROM builder AS development
RUN pip install --no-cache -r requirements/dev.txt
EXPOSE 2992
EXPOSE 5000
CMD [ "npm", "start" ]
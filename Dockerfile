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

WORKDIR /app

RUN useradd -m sid
RUN chown -R sid:sid /app
USER sid
ENV PATH="/home/sid/.local/bin:${PATH}"

COPY --from=builder --chown=sid:sid /app/webapp_hamburg_vs_hotdog/static /app/webapp_hamburg_vs_hotdog/static
COPY requirements requirements
RUN pip install --no-cache --user -r requirements/prod.txt

COPY . .

EXPOSE 5000
CMD ["gunicorn", "-w", "3", "-k", "gevent", "-b", "0.0.0.0:5000", "webapp_hamburg_vs_hotdog.app:create_app()"]


#TODO: Figure out reintroduction of Development Section
# ================================= DEVELOPMENT STAGE ================================
# docker build --target development -t <image-name> .
FROM builder AS development
RUN pip install --no-cache -r requirements/dev.txt
EXPOSE 2992
EXPOSE 5000
CMD [ "npm", "start" ]
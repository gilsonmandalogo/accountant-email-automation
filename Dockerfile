FROM cypress/base:18.12.1

ENTRYPOINT [ "sh" ]
WORKDIR /usr/src/app
RUN mkdir attachments
RUN npm config set update-notifier false
COPY wise-statements.config.json /root/.config/wise-statements/.config.json
COPY vendus-export.config.json /root/.config/vendus-export/.config.json
COPY private.pem ./
COPY run.sh ./
COPY .env ./.env
COPY app.js package.json yarn.lock loadShellEnv.js ./
RUN yarn install --production --frozen-lockfile
CMD [ "run.sh" ]

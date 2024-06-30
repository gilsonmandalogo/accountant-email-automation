FROM cypress/base:20.14.0

ENTRYPOINT [ "bash" ]
WORKDIR /usr/src/app
RUN mkdir attachments
RUN npm config set update-notifier false
COPY run.sh loadShellEnv.js ./
COPY app.js package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
CMD [ "run.sh" ]

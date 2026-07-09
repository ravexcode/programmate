# Docket settings for NextJS 16

FROM node:26-alpine

COPY . .

CMD [ "next", "start" ]
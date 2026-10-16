FROM node:24-alpine
WORKDIR /app
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["node", "--input-type=module", "-e", "import { server } from './server.js'; server.listen(3000, '0.0.0.0');"]

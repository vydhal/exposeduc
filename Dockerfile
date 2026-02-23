# syntax=docker/dockerfile:1

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
# Necessário para o Prisma funcionar no Alpine Linux
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Enable corepack for pnpm/yarn, or just use npm
RUN corepack enable

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
COPY prisma ./prisma/
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app
# Adicionamos uma master key fake para o Prisma passar do step de build estático
# O App não conectará de verdade no banco no build
ENV DATABASE_URL="postgresql://fake:fake@localhost:5432/fake"
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
# Necessário para o Prisma rodar no contêiner final
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Instala prisma globalmente para podermos rodar as migrações em produção
RUN npm install -g prisma@5.22.0

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Copia e dá permissão de execução ao script de inicialização
COPY start.sh ./
RUN chmod +x start.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./start.sh"]

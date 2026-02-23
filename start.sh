#!/bin/sh
echo "Executando push do esquema do banco de dados (Cria/Sincroniza tabelas silenciosamente)..."
npx prisma db push --accept-data-loss

echo "Iniciando o servidor Next.js..."
exec node server.js

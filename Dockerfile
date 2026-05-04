# --- стадия сборки ---
FROM node:22 AS build

# рабочая директория внутри контейнера
WORKDIR /app

# копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm ci

# копируем весь проект и собираем production-версию
COPY . .
RUN npm run build

# --- стадия запуска ---
FROM nginx:stable-alpine AS production

# копируем собранные файлы из предыдущей стадии в nginx
COPY --from=build /app/dist /usr/share/nginx/html

# открываем порт 80
EXPOSE 80

# запускаем nginx на переднем плане
CMD ["nginx", "-g", "daemon off;"]

# Guía de Despliegue y Mantenimiento de Producción - Grupo MIT

Última actualización: Junio 2026

---

## 🏗 Arquitectura del Servidor

| Elemento | Valor |
|---|---|
| **App Engine** | Next.js corriendo sobre **PM2** |
| **Puerto de la App** | `3010` (3007 ocupado, 3000-3009 en uso) |
| **Base de Datos** | PostgreSQL en Docker (`mit-db`) |
| **Proxy Inverso** | Nginx → `web.grupomit.com.ar` → puerto `3007` |
| **Ruta del Proyecto** | `/root/mit/mit` |
| **Repo GitHub** | `https://github.com/facun3625/mit.git` |

---

## 🚀 Primer Deploy (primera vez en el servidor)

### 1. Clonar el proyecto

```bash
mkdir -p ~/mit
git clone https://github.com/facun3625/mit.git ~/mit/mit
cd ~/mit/mit
```

### 2. Crear el contenedor PostgreSQL con puerto fijo

> ⚠️ Usar puerto `5434` para no colisionar con Araí (`5433`) ni PostgreSQL nativo (`5432`)

```bash
docker run -d \
  --name mit-db \
  -p 5434:5432 \
  -e POSTGRES_USER=mit_user \
  -e POSTGRES_PASSWORD=mit_prod_2026 \
  -e POSTGRES_DB=mit_db \
  --restart unless-stopped \
  -v mit_pgdata:/var/lib/postgresql/data \
  postgres:15-alpine
```

Verificar que levantó:
```bash
docker ps | grep mit-db
```

### 3. Crear el archivo `.env`

```bash
nano ~/mit/mit/.env
```

Contenido:
```env
DATABASE_URL="postgresql://mit_user:mit_prod_2026@localhost:5434/mit_db?schema=public"
SESSION_SECRET="cambiar_por_un_string_largo_y_aleatorio"
NODE_ENV="production"
```

> 💡 Generá un SESSION_SECRET seguro con: `openssl rand -base64 32`

### 4. Instalar dependencias y buildear

```bash
cd ~/mit/mit
npm install
npx prisma generate
npx prisma db push
npm run build
```

### 5. Configurar PM2

```bash
PORT=3010 pm2 start npm --name "mit" -- start
pm2 save
pm2 startup   # seguir las instrucciones que imprime para arranque automático
```

Verificar que está corriendo:
```bash
pm2 status
curl http://localhost:3007
```

### 6. Configurar Nginx

```bash
nano /etc/nginx/sites-available/grupomit
```

Contenido:
```nginx
server {
    listen 80;
    server_name web.grupomit.com.ar;

    # Tamaño máximo para subida de imágenes
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar y recargar:
```bash
ln -s /etc/nginx/sites-available/grupomit /etc/nginx/sites-enabled/
nginx -t
sudo systemctl reload nginx
```

### 7. SSL con Certbot (recomendado)

```bash
certbot --nginx -d web.grupomit.com.ar
```

---

## 🔄 Proceso de Actualización Estándar

Cada vez que haya cambios nuevos en el repo:

```bash
cd ~/mit/mit
git pull origin main
npx prisma generate
npx prisma db push
npm run build
pm2 restart mit
```

---

## 🛠 Borrón y Cuenta Nueva (si algo falla gravemente)

```bash
# 1. Backup del .env y uploads
cp ~/mit/mit/.env ~/mit/.env.backup
cp -r ~/mit/mit/public/uploads ~/mit/uploads.backup 2>/dev/null || true

# 2. Limpiar y clonar
rm -rf ~/mit/mit
git clone https://github.com/facun3625/mit.git ~/mit/mit

# 3. Restaurar archivos críticos
cp ~/mit/.env.backup ~/mit/mit/.env
cp -r ~/mit/uploads.backup ~/mit/mit/public/uploads 2>/dev/null || true

# 4. Reinstalar y buildear
cd ~/mit/mit
npm install
npx prisma generate
npx prisma db push
npm run build
PORT=3010 pm2 restart mit
```

---

## 🔑 Variables Críticas del `.env`

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://mit_user:mit_prod_2026@localhost:5434/mit_db?schema=public` |
| `SESSION_SECRET` | String aleatorio largo (mínimo 32 chars) |
| `NODE_ENV` | `production` |

---

## 📸 Gestión de Imágenes / Uploads

Las imágenes subidas desde el admin se guardan en `public/uploads/`.

> ⚠️ **Si borrás la carpeta del proyecto, las imágenes se pierden.**
> Siempre hacer backup de `public/uploads` antes de cualquier operación destructiva.

---

## ⚠️ Problema conocido: mit-db cambia IP al reiniciar

Como se usó **puerto fijo (`5434`)** desde el inicio, este problema **no debería ocurrir** ya que la app usa `localhost:5434`.

Si de todas formas la DB no responde tras un reinicio:

```bash
# Verificar que el contenedor esté corriendo
docker ps | grep mit-db

# Si no está, levantarlo
docker start mit-db

# Reiniciar la app
pm2 restart mit
```

---

## 🔍 Comandos de Auxilio

```bash
# App
pm2 logs mit --lines 50           # Ver errores de la app
pm2 status                         # Estado de todas las apps
pm2 restart mit                    # Reiniciar app
pm2 stop mit                       # Detener app

# Base de datos
docker ps -a                       # Estado de contenedores
docker start mit-db                # Levantar DB si está caída
docker logs mit-db --tail 30       # Logs de la DB
docker exec -it mit-db psql -U mit_user -d mit_db   # Consola SQL

# Servidor
netstat -tlpn                      # Ver puertos en uso
sudo systemctl reload nginx        # Recargar Nginx
nginx -t                           # Verificar config de Nginx
free -h                            # Memoria disponible
df -h /                            # Espacio en disco
```

---

## 📋 Puertos del servidor (resumen)

| Puerto | Uso |
|---|---|
| `3000` | Profly (no tocar) |
| `3006` | Araí Yerba Mate |
| **`3010`** | **Grupo MIT** ← esta app |
| `5432` | PostgreSQL nativo (si existe) |
| `5433` | Araí DB |
| **`5434`** | **MIT DB** ← este proyecto |

---

*Facundo Arteaga Sola - Grupo MIT*

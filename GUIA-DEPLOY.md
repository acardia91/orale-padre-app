# ORALE PADRE — Guia de Deploy en Vercel

## Que necesitas antes de empezar

- Una cuenta en GitHub (gratis): https://github.com
- Una cuenta en Vercel (gratis): https://vercel.com
- Git instalado en tu ordenador (si usas Mac ya lo tienes, si no: https://git-scm.com)
- Node.js instalado (version 18+): https://nodejs.org

Para comprobar que tienes todo, abre Terminal y escribe:
```
node --version
git --version
```
Si salen numeros de version, estas listo.

---

## PASO 1: Descargar el proyecto

Descarga el archivo `orale-vercel.zip` y descomprimelo en tu escritorio o donde quieras.

Tendras esta estructura:
```
orale-vercel/
  app/
    OralePadreApp.jsx   ← La app entera
    layout.js           ← Layout de Next.js
    page.js             ← Pagina principal
  public/
  next.config.js
  package.json
  .gitignore
```

---

## PASO 2: Probar en local

Abre Terminal, navega a la carpeta y ejecuta:

```bash
cd ~/Desktop/orale-vercel    # o donde hayas descomprimido
npm install
npm run dev
```

Abre el navegador en **http://localhost:3000** — deberias ver la pantalla de login de Orale Padre.

Prueba las 3 cuentas:
- ale / orale2026 → Socio
- carlos / carlos2026 → Encargado
- pedro / pedro2026 → Empleado

Si funciona todo, sigue al paso 3.

---

## PASO 3: Crear repositorio en GitHub

### Opcion A: Desde Terminal (rapido)

```bash
cd ~/Desktop/orale-vercel

git init
git add .
git commit -m "Orale Padre v1.0"
```

Ve a https://github.com/new y crea un repositorio nuevo:
- Nombre: `orale-padre-app`
- Privado (recomendado)
- NO marques "Add a README"
- Pulsa "Create repository"

GitHub te mostrara instrucciones. Copia las dos lineas del bloque "push an existing repository":

```bash
git remote add origin https://github.com/TU_USUARIO/orale-padre-app.git
git branch -M main
git push -u origin main
```

### Opcion B: Desde GitHub Desktop (mas facil)

1. Descarga GitHub Desktop: https://desktop.github.com
2. File → Add Local Repository → selecciona la carpeta `orale-vercel`
3. Te pedira crear un repositorio — acepta
4. Commit: escribe "Orale Padre v1.0" y pulsa "Commit to main"
5. Pulsa "Publish repository" arriba a la derecha
6. Desmarca "Keep this code private" si quieres que sea publico, o dejalo privado

---

## PASO 4: Conectar con Vercel

1. Ve a https://vercel.com y regístrate con tu cuenta de GitHub
2. Pulsa **"Add New Project"**
3. Te mostrara tus repositorios de GitHub — selecciona **orale-padre-app**
4. En la configuracion:
   - **Framework Preset**: Next.js (se detecta automatico)
   - **Root Directory**: `./` (dejar por defecto)
   - **Build Command**: `next build` (dejar por defecto)
   - **Output Directory**: `.next` (dejar por defecto)
5. Pulsa **"Deploy"**

Vercel construira el proyecto (1-2 minutos). Cuando termine:

**Tu app estara en vivo en una URL tipo:**
`https://orale-padre-app.vercel.app`

---

## PASO 5: Dominio personalizado (opcional)

Si quieres usar un dominio como `app.orale-padre.com`:

1. En Vercel, ve a tu proyecto → Settings → Domains
2. Escribe tu dominio: `app.orale-padre.com`
3. Vercel te dara un registro DNS (tipo CNAME)
4. Ve al panel de tu proveedor de dominio y anade ese registro
5. Espera 5-10 minutos a que propague

---

## Actualizar la app

Cada vez que quieras hacer cambios:

1. Edita los archivos en tu carpeta local
2. En Terminal:
```bash
cd ~/Desktop/orale-vercel
git add .
git commit -m "Descripcion del cambio"
git push
```
3. Vercel detecta el push y redeploya automaticamente en 1-2 minutos

O desde GitHub Desktop: haz commit y pulsa "Push origin".

---

## Credenciales de acceso

| Usuario | Password | Rol | Local |
|---------|----------|-----|-------|
| ale | orale2026 | Socio | Todos |
| carlos | carlos2026 | Encargado | San Luis |
| pedro | pedro2026 | Empleado | San Luis |

**IMPORTANTE**: Estas credenciales estan en el codigo fuente. Para produccion real, necesitaras un sistema de autenticacion con base de datos (Supabase Auth, NextAuth, etc). De momento para pruebas internas esta bien.

---

## Costes

- **Vercel Hobby (gratis)**: Hasta 100GB de ancho de banda/mes, builds ilimitados. Mas que suficiente para uso interno.
- **Vercel Pro (20$/mes)**: Si necesitas mas ancho de banda, analytics, o password protection.
- **Dominio**: 10-15$/ano si quieres uno personalizado.

---

## Problemas comunes

**"npm install falla"**
→ Asegurate de tener Node.js 18+: `node --version`

**"La pagina se queda en blanco en Vercel"**
→ Ve a Vercel → tu proyecto → Deployments → pulsa en el ultimo → "View Build Logs" y busca errores

**"Los cambios no se ven"**
→ Vercel cachea. Prueba con Ctrl+Shift+R (hard refresh). Si no, ve a Vercel → Deployments y verifica que el ultimo deploy fue exitoso.

**"Quiero anadir mas usuarios"**
→ Edita el array USERS en app/OralePadreApp.jsx, busca `var USERS = [` y anade mas objetos. Haz commit y push.

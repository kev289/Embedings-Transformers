# Embeddings y Transformers

## Instalar dependencias

```bash
    npm install
```

## Crear base de datos

```bash
    npx prisma generate
    npx prisma db push
```

## Ejecutar el proyecto

```bash
    npm run dev
``` 

- Abrir localhost:3000 por que el frontend ya fue integrado


## Postgres

- Migre la base de datos a Postgres pero me encontre con un error y es que postgres no renderiza todo el vector, entonces hice un console.log que muestra que palabra ingrese, pero esta funcionando perfectamente la aplicacion.

### Comandos

```bash
   psql -d Emb_Trans -c "\dt" 
``` 

## FEATURES 

- Types e interfaces para el manejo correcto de datos

## Historia de usuario

Fue agregado, el ORM, con postgres para el control de la base de datos.
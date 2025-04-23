## Pushear los cambios al repositorio

git add .
git commit -m "Mensaje del commit"
git push origin master

## Cambiar de version

npm version patch # Para versiones pequeñas (1.0.0 → 1.0.1)
npm version minor # Para cambios medianos (1.0.0 → 1.1.0)
npm version major # Para cambios grandes (1.0.0 → 2.0.0)

## Publicar el paquete

npm publish

## Verificar su publicacion

npm view sode-extend-react

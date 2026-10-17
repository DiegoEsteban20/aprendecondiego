# Preparación de publicación

## Estado de este paquete

Repositorio público: https://github.com/DiegoEsteban20/aprendecondiego. La versión base es **0.2.0**, ampliada con academia, taller y laboratorio visual, con soporte parcial de FortiOS y sin soporte PAN-OS. El sitio estático se publica en https://diegoesteban20.github.io/aprendecondiego/; no se despliega una API pública.

## Presentación sugerida

- Nombre: `aprendecondiego`.
- Descripción: `Interactive firewall investigation lab: trace IP references, explain policy findings and compare synthetic FortiOS configurations.`
- Topics: `firewall`, `fortinet`, `network-security`, `homelab`, `blue-team`, `javascript`, `learning`.
- Licencia: MIT.
- Imagen principal: `docs/preview.png`.

## Antes del primer push

1. Revisa el proyecto, el manual y los límites declarados.
2. Ejecuta `node --test`.
3. Verifica que sólo hay datos sintéticos y que no se añadieron configuraciones reales.
4. Decide si el repositorio será público o privado.
5. Configura tu identidad Git y la cuenta de GitHub correspondiente.

## Publicación manual

Crea un repositorio vacío en tu cuenta, sin README ni licencia generados, y ejecuta desde esta carpeta:

```sh
git init
git add .
git commit -m "Release Firewall Detective 0.2.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/firewall-detective.git
git push -u origin main
```

Los comandos anteriores sirven como referencia de publicación desde una copia nueva; no los repitas sobre un repositorio ya inicializado. Para cambios posteriores, revisa el diff, crea un commit y realiza el push a la rama correspondiente. Confirma el resultado de Actions antes de anunciar una versión.

## Qué enseñar en la demo

1. Caso La puerta abierta y explicación de ANY_ANY.
2. Búsqueda de 10.20.0.10 y relaciones.
3. Cambio de ALL a HTTPS y comparación por campo.
4. Guía de uso y exportación del reporte.

GitHub Pages sólo sirve archivos estáticos y no ejecuta este servidor Node.js. El repositorio se puede publicar sin una demo alojada. Para una demo online futura, diseña un despliegue con datos sintéticos y los controles necesarios antes de exponer el servidor.

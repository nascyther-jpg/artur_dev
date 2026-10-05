# Modelos 3D

Coloque aqui arquivos `.glb` para substituir os placeholders procedurais.

1. Exporte o modelo em glTF binário (`.glb`), de preferência low-poly e com texturas comprimidas.
2. Salve nesta pasta, por exemplo `public/models/naruto.glb`.
3. Em `src/data/models.ts`, defina `url: "models/naruto.glb"` no slot correspondente e ajuste `scale`.

Enquanto `url` for `null`, ou se o arquivo falhar ao carregar, o placeholder continua sendo exibido.

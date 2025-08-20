async function loadButtons(client) {
    const { loadFiles } = require('../Functions/fileLoader');
    await client.buttons.clear();

    const files = await loadFiles('Buttons');
    files.forEach((file) => {
        const button = require(file);

        // Verificación para evitar errores si el archivo no está bien estructurado
        if (!button?.id) {
            console.warn(`⚠️ El botón en el archivo '${file}' no tiene definida 'id'. Saltando...`);
            return;
        }

        client.buttons.set(button.id, button);
    });

    console.log('✅ Botones cargados correctamente');
}

module.exports = { loadButtons };

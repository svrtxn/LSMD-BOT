async function loadButtons(client) {
    const { loadFiles } = require('../Functions/fileLoader');
    await client.buttons.clear();

    const files = await loadFiles('Buttons');
    files.forEach((file) => {
        const button = require(file);

        // Verificación para evitar errores si el archivo no está bien estructurado
        if (!button?.data?.name) {
            console.warn(`⚠️ El botón en el archivo '${file}' no tiene definida 'data.name'. Saltando...`);
            return;
        }

        client.buttons.set(button.data.name, button);
    });

    console.log('✅ Botones cargados correctamente');
}

module.exports = { loadButtons };

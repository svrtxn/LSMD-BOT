const { loadCommands } = require('../../Handlers/commandHandler');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ El cliente se ha iniciado correctamente: ${client.user.tag}`);

        try {
            await loadCommands(client); // ✅ AQUÍ debe ejecutarse
        } catch (error) {
            console.error("❌ Error al cargar comandos:", error);
        }
    },
};

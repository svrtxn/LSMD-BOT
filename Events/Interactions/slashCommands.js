const { ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {*} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        // 🎯 Comandos de barra (slash)
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({
                    content: '❌ Comando no encontrado.',
                    ephemeral: true
                });
            }

            // Restricción opcional para desarrollador
            if (command.developer && interaction.user.id !== "321441044384186369") {
                return interaction.reply({
                    content: '❌ Solo el desarrollador puede usar este comando.',
                    ephemeral: true
                });
            }

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(`❌ Error al ejecutar comando: ${err}`);
                return interaction.reply({
                    content: '❌ Ocurrió un error al ejecutar el comando.',
                    ephemeral: true
                });
            }
        }

        // 🔘 Botones
        else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) {
                console.error(`❌ Botón no encontrado: ${interaction.customId}`);
                return;
            }

            try {
                await button.execute(interaction, client);
            } catch (err) {
                console.error(`❌ Error al ejecutar botón: ${err}`);
                return interaction.reply({
                    content: '❌ Ocurrió un error al ejecutar la acción del botón.',
                    ephemeral: true
                });
            }
        }

        // 📩 Select Menus
        else if (interaction.isStringSelectMenu()) {
            const menu = client.selectMenus?.get(interaction.customId);
            if (!menu) {
                console.error(`❌ Select menu no encontrado: ${interaction.customId}`);
                return;
            }

            try {
                await menu.execute(interaction, client);
            } catch (err) {
                console.error(`❌ Error al ejecutar select menu: ${err}`);
                return interaction.reply({
                    content: '❌ Ocurrió un error al procesar la selección.',
                    ephemeral: true
                });
            }
        }
    }
};

const { ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {*} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({ 
                    content: '❌ Comando no encontrado', 
                    ephemeral: true 
                });
            }

            if (command.developer && interaction.user.id !== "321441044384186369") {
                return interaction.reply({
                    content: '❌ Solo el desarrollador del bot puede usar este comando.',
                    ephemeral: true,
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

        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            
            if (!button) {
                console.error(`❌ Botón no encontrado: ${customId}`);
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
    }
};

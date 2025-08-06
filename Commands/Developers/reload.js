const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    Client,
} = require('discord.js');

const { loadCommands } = require('../../Handlers/commandHandler');
const { loadEvents } = require('../../Handlers/eventHandler');
const { loadButtons } = require('../../Handlers/buttonHandler');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Recarga los comandos o eventos del bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) =>
            options.setName('events').setDescription('Recarga los eventos del bot')
        )
        .addSubcommand((options) =>
            options.setName('commands').setDescription('Recarga los comandos del bot')
        )
        .addSubcommand((options) =>
            options.setName('buttons').setDescription('Recarga los botones del bot')
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'events': {
                for (const [key, value] of client.events) {
                    client.removeListener(key, value);
                }

                loadEvents(client);

                await interaction.reply({
                    content: `✅ Eventos recargados correctamente.`,
                    ephemeral: true,
                });

                break;
            }

            case 'commands': {
                loadCommands(client);

                await interaction.reply({
                    content: `✅ Comandos recargados correctamente.`,
                    ephemeral: true,
                });

                break;
            }
            case 'buttons': {
                loadButtons(client);

                await interaction.reply({
                    content: `✅ Botones recargados correctamente.`,
                    ephemeral: true,
                });

                break;
            }

            default: {
                await interaction.reply({
                    content: `❌ Subcomando no reconocido.`,
                    ephemeral: true,
                });
            }
        }
    },
};

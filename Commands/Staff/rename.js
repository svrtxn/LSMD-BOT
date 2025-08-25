const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Cambiar el nombre del canal actual')
        .addStringOption((option) =>
            option.setName('nombre')
                .setDescription('Nuevo nombre para el canal')
                .setRequired(true)
        )
        // permisos
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const nuevoNombre = interaction.options.getString('nombre');
        const canal = interaction.channel;

        try {
            const nombreAnterior = canal.name;

            await canal.setName(nuevoNombre);

            await interaction.reply({
                content: `✅ El canal **${nombreAnterior}** ahora se llama **${nuevoNombre}**.`,
                ephemeral: true
            });
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: '❌ Hubo un error al intentar renombrar el canal.',
                ephemeral: true
            });
        }
    }
};

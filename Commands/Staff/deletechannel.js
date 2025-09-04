const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletechannel')
        .setDescription('Eliminar el canal actual')
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Razón de la eliminación del canal')
                .setRequired(false)
        )
        // Solo usuarios con permiso de gestionar canales
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const canal = interaction.channel;
        const razon = interaction.options.getString('razon') || 'Sin especificar';

        try {
            const nombre = canal.name;

           
            await interaction.reply({
                content: `🗑️ El canal **${nombre}** será eliminado. Razón: ${razon}`,
                ephemeral: true
            });
        
            await canal.delete(razon);

        } catch (err) {
            console.error(err);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ Hubo un error al intentar eliminar el canal.',
                    ephemeral: true
                });
            }
        }
    }
};

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

           
            const logChannel = await interaction.guild.channels.fetch('1402480570604453930');

            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🗑️ Canal eliminado')
                    .addFields(
                        { name: 'Canal', value: nombre, inline: true },
                        { name: 'Eliminado por', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Razón', value: razon }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

        
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

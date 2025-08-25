const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Habilitar panel de marcación de horario.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const canalPanelID = '1402774649515020388';
        const canal = client.channels.cache.get(canalPanelID);

        if (!canal || !canal.isTextBased()) {
            return interaction.reply({ content: '❌ No se pudo encontrar el canal del panel o no es un canal de texto.', ephemeral: true });
        }

        const mensajesParaBorrar = await canal.messages.fetch({ limit: 100 });
        await canal.bulkDelete(mensajesParaBorrar, true).catch(console.error);

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('entrar-servicio').setLabel('Entrar en Servicio').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('salir-servicio').setLabel('Salir de Servicio').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('horas').setLabel('Ver Horas').setStyle(ButtonStyle.Secondary)
        );

        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🩺 Panel de Servicio')
            .setDescription(`**Entrar o salir de servicio**\n• Haz clic en **Entrar en servicio** para comenzar tu turno.\n• Haz clic en **Salir de servicio** para finalizar tu turno.\n\n**🕐 Ver horas de trabajo**\nConsulta tus horas acumuladas presionando el botón **Ver horas**.`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: 'Los Santos Medical Department | Complex RP', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        await canal.send({ embeds: [embed], components: [buttonRow] });
        await interaction.reply({ content: `✅ Panel enviado correctamente al canal <#${canalPanelID}>.`, ephemeral: true });

        // Log
        const logChannel = await interaction.guild.channels.fetch('1402480570604453930');
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🟢 Panel de servicio enviado')
                .addFields({ name: 'Canal', value: canal.name, inline: true }, { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true })
                .setTimestamp();
            await logChannel.send({ embeds: [logEmbed] });
        }
    }
};

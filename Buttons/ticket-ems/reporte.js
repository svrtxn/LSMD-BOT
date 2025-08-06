const { ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'reporte',
    },

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#ff4d4d')
            .setTitle('📌 Reporte')
            .setDescription('Inicia un reporte médico, administrativo o disciplinario. Por favor, proporciona todos los antecedentes y detalles relevantes para que pueda ser evaluado adecuadamente. Un miembro de la junta directiva se comunicará contigo.')
            .setFooter({ text: 'Junta Directiva - LSMD', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const ticketChannel = await interaction.guild.channels.create({
            name: `reporte-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402504695628435576',
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: ['ViewChannel']
                }
            ]
        });

// BOTÓN "Cerrar Ticket"
        const cerrarButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('cerrar-ticket')
                .setLabel('Cerrar')
                .setStyle(ButtonStyle.Danger)
        );
        // Enviar embed al canal creado mencionando al usuario
        await ticketChannel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [cerrarButton], });

        await interaction.reply({
            content: `✅ Ticket de reporte creado en <#${ticketChannel.id}>.`,
            ephemeral: true
        });
    }
};

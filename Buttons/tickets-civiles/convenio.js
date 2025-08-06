const { ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'convenio',
    },

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#5b9bd5')
            .setTitle('SOLICITUD DE CONVENIO🤝 ')
            .setDescription('Gracias por tu interés en establecer un convenio con **LSMD**. Un miembro de la junta directiva se pondrá en contacto contigo.')
            .setFooter({ text: 'Los Santos Medical Department', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const ticketChannel = await interaction.guild.channels.create({
            name: `convenio-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402500642219753588',
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
            content: `✅ Ticket de convenio creado en <#${ticketChannel.id}>.`,
            ephemeral: true
        });
    }
};

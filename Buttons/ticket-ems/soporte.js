const { ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'soporte',
    },

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#ff4d4d')
            .setTitle('📋 Soporte y Consultas')
            .setDescription('Por favor, indícanos tus dudas, consultas o problemas, y con gusto te ayudaremos a resolverlas.')
            .setFooter({ text: 'Junta Directiva - LSMD', iconURL: interaction.guild.iconURL({ dynamic: true }) });


        const ticketChannel = await interaction.guild.channels.create({
            name: `ascenso-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402505398186938478',
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
            content: `✅ Ticket de soporte o dudas creado en <#${ticketChannel.id}>.`,
            ephemeral: true
        });
    }
};

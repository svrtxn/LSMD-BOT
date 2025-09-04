const { 
    ChannelType, 
    EmbedBuilder,    
    ButtonBuilder, 
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    id: 'evento',
  
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#5b9bd5')
            .setTitle('SUPEVISIÓN DE EVENTO 🤝 ')
            .setDescription('Gracias por tu interés en incluir a un SAMS para supervisar el evento. Un miembro de la junta directiva se pondrá en contacto contigo.')
            .setFooter({ text: 'San Andreas Medical Services', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const ticketChannel = await interaction.guild.channels.create({
            name: `supEvento-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1413250664838201435',
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
        // Botón "Cerrar Ticket"
        const cerrarButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('cerrar-ticket')
                .setLabel('Cerrar')
                .setStyle(ButtonStyle.Danger)
        );
        await ticketChannel.send({ 
            content: `<@${interaction.user.id}> <@&1413250858896068781>`, 
            embeds: [embed], 
            components: [cerrarButton], 
        });

        await interaction.reply({
            content: `✅ Ticket de convenio creado en <#${ticketChannel.id}>.`,
            ephemeral: true
        });
    }
};

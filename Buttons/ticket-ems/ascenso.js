const { ChannelType,
        EmbedBuilder,  
        ButtonBuilder, 
        ButtonStyle } = require('discord.js');

module.exports = {
    id: 'ascenso',
  
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#ff4d4d')
            .setTitle('📋 Solicitar Ascenso')
            .setDescription('Has solicitado un **ascenso de rango** o una **especialidad** dentro del equipo médico. Un superior se pondrá en contacto contigo para continuar con el proceso.')
            .setFooter({ text: 'Junta Directiva - LSMD', iconURL: interaction.guild.iconURL({ dynamic: true }) });

        const ticketChannel = await interaction.guild.channels.create({
            name: `ascenso-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402505050882052168', // ID de la categoría ASCENSOS
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
            content: `<@${interaction.user.id}> <@&1354844183030010049>`, 
            embeds: [embed], 
            components: [cerrarButton], 
        });

        await interaction.reply({
            content: `✅ Ticket de solicitud de ascenso creado en <#${ticketChannel.id}>.`,
            ephemeral: true
        });
    }
};

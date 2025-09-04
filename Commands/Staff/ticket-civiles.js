const { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-civiles')
        .setDescription('Habilitar tickets para civiles')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('cita-medica')
                .setLabel('📅 Cita Médica')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('psicotecnico')
                .setLabel('🧠 Psicotécnico')
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId('postulacion')
                .setLabel('📋 Postulación EMS')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId('evento')
                .setLabel('🎉 Supervisión de Evento')
                .setStyle(ButtonStyle.Secondary
                )
                
                
        );

        const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('📌 Postulación y Solicitudes | SAMS')
    .setDescription(`
        Bienvenido/a al sistema de atención médica de **San Andreas Medical Service** 🏥.

        Utiliza los botones a continuación para abrir un ticket privado. Todo el proceso será interno y confidencial.

        📅 **Cita Médica**  
        Solicita una cita médica en cualquier especialidad para identificar y tratar problemas de salud.

        🧠 **Psicotécnico**  
        Solicita tu evaluación psicológica por SAMS para certificar que estás mental y físicamente apto para poseer y portar un arma en el Estado de San Andreas.

        📋 **Postulación SAMS**  
        Opción para **postular a formar parte del equipo médico de SAMS**. Al seleccionarla, iniciarás el proceso de reclutamiento.

        🎉 Supervisión de Evento  
        ¿Usted o su PYME requieren personal de SAMS para supervisar o cubrir un evento? Podemos ayudarle, siempre que haya notificación previa.
    `)
    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    .setFooter({
        text: 'San Andreas Medical Service | Distrito X',
        iconURL: interaction.guild.iconURL({ dynamic: true }),
    });

    
        await interaction.channel.send({
            embeds: [embed],
            components: [button]
        });

        await interaction.reply({
            content: '✅ Sistema de tickets habilitado. Los civiles pueden abrir tickets haciendo clic en el botón.',
            ephemeral: true
        });

       
    }
};

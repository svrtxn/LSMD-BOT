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
        .setName('ticket-ems')
        .setDescription('Habilitar tickets para EMS')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ascenso')
                .setLabel('📋 Solicitar Ascenso')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('reporte')
                .setLabel('📌 Reporte')
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId('soporte')
                .setLabel('🤝 Soporte o dudas')
                .setStyle(ButtonStyle.Success),

                
        );

        const embed = new EmbedBuilder()
    .setColor('#2ecc71')
    .setTitle('🩺 Panel de Solicitudes Médicas')
    .setDescription(`
Bienvenido al panel interno de solicitudes del **Los Santos Medical Department**.

Utiliza los botones a continuación para abrir un **ticket privado** con la junta directiva. Todo el proceso será interno y confidencial.

📌 **Realizar un reporte**  
Inicia un reporte médico, administrativo o disciplinario. Proporciona todos los antecedentes relevantes para su evaluación.

📋 **Solicitar Ascenso / Especialidad**  
Solicita un **ascenso de rango** dentro del equipo médico o una **especialidad** (como cirugía, pediatría, psiquiatría, etc.) según tu cargo y trayectoria.

🤝 **Soporte o dudas**  
¿Tienes alguna inquietud, necesitas ayuda con procedimientos, normativa, permisos o sistemas internos? Abre aquí un canal directo con Dirección Médica.
    `)
    .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    .setFooter({
        text: 'Los Santos Medical Department | Complex RP',
        iconURL: interaction.guild.iconURL({ dynamic: true }),
    });

    
        await interaction.channel.send({
            embeds: [embed],
            components: [button]
        });

        await interaction.reply({
            content: '✅ Sistema de tickets habilitado. Los EMS pueden abrir tickets haciendo clic en el botón.',
            ephemeral: true
        });

       
    }
};

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
                .setCustomId('convenio')
                .setLabel('🤝 Convenio')
                .setStyle(ButtonStyle.Secondary
                )
                
                
        );

        const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('📌 Postulación y Solicitudes | L.S.M.D')
    .setDescription(`
        Bienvenido/a al sistema de atención médica de **Los Santos Medical Department** 🏥.

        Selecciona el tipo de solicitud que deseas realizar presionando uno de los botones a continuación.

        📅 **Cita Médica**  
        Solicitud para **agendar una consulta médica específica** con nuestro equipo.

        🧠 **Psicotécnico**  
        Evaluación psicológica obligatoria para **obtener tu licencia de portación de armas**.

        📋 **Postulación EMS**  
        Opción para **postular a formar parte del equipo médico de LSMD**. Al seleccionarla, iniciarás el proceso de reclutamiento.

        🤝 **Convenio**  
        Si eres **dueño o encargado de un local**, puedes solicitar aquí un **convenio oficial con LSMD** para acceder a beneficios exclusivos para tus empleados.

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
            content: '✅ Sistema de tickets habilitado. Los civiles pueden abrir tickets haciendo clic en el botón.',
            ephemeral: true
        });

       
    }
};

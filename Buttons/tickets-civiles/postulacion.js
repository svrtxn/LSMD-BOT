const {
    ChannelType,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    PermissionFlagsBits,   
    ButtonBuilder, 
    ButtonStyle      
} = require('discord.js');

module.exports = {
    id: 'postulacion',
    
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('formularioPostulacion')
            .setTitle('Formulario de Postulación 📋');

        const nombreIC = new TextInputBuilder()
            .setCustomId('nombreIC')
            .setLabel('Nombre y Apellido (IC)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const edadOOC = new TextInputBuilder()
            .setCustomId('edadOOC')
            .setLabel('Edad (OOC)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const edadIC = new TextInputBuilder()
            .setCustomId('edadIC')
            .setLabel('Edad (IC)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const ilegal = new TextInputBuilder()
            .setCustomId('ilegal')
            .setLabel('¿Pertenece a alguna organización ilegal?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const experiencia = new TextInputBuilder()
            .setCustomId('experiencia')
            .setLabel('¿Qué te motiva a unirte? ¿Tienes experiencia?')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nombreIC),
            new ActionRowBuilder().addComponents(edadOOC),
            new ActionRowBuilder().addComponents(edadIC),
            new ActionRowBuilder().addComponents(ilegal),
            new ActionRowBuilder().addComponents(experiencia)
        );

        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 5 * 60 * 1000,
            filter: i => i.user.id === interaction.user.id && i.customId === 'formularioPostulacion',
        }).catch(() => null);

        if (!submitted) return;

        const nombreICValue = submitted.fields.getTextInputValue('nombreIC');
        const edadOOCValue = submitted.fields.getTextInputValue('edadOOC');
        const edadICValue = submitted.fields.getTextInputValue('edadIC');
        const ilegalValue = submitted.fields.getTextInputValue('ilegal');
        const experienciaValue = submitted.fields.getTextInputValue('experiencia');

        const ticketChannel = await interaction.guild.channels.create({
            name: `postulacion-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402500662624911510', // reemplazar ID de categoría POSTULACION
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                    ],
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });

        const embed = new EmbedBuilder()
            .setColor('#28a745')
            .setTitle('📋 POSTULACIÓN A L.S.M.D')
            .setDescription(`Formulario completado por <@${interaction.user.id}>`)
            .addFields(
                { name: 'Nombre y Apellido (IC):', value: nombreICValue },
                { name: 'Edad (OOC):', value: edadOOCValue },
                { name: 'Edad (IC):', value: edadICValue },
                { name: '¿Pertenece a alguna organización ilegal?', value: ilegalValue },
                { name: 'Motivación y experiencia:', value: experienciaValue }
            )
            .setFooter({
                text: 'Los Santos Medical Department',
                iconURL: interaction.guild.iconURL({ dynamic: true }),
            });

        // BOTÓN "Cerrar Ticket"
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


        await submitted.reply({
            content: `✅ ¡Formulario enviado! Tu ticket fue creado en <#${ticketChannel.id}>.`,
            ephemeral: true,
        });
    },
};

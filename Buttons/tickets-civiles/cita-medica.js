const {
    ChannelType,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    data: {
        name: 'cita-medica',
    },

    async execute(interaction) {
        // 1. Crear el formulario
        const modal = new ModalBuilder()
            .setCustomId('formularioCitaMedica')
            .setTitle('SOLICITUD DE CITA MÉDICA 📅');

        const nombreIC = new TextInputBuilder()
            .setCustomId('nombreIC')
            .setLabel('Nombre IC')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const telefonoIC = new TextInputBuilder()
            .setCustomId('telefonoIC')
            .setLabel('Número de teléfono IC')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const motivo = new TextInputBuilder()
            .setCustomId('motivo')
            .setLabel('Motivo de la consulta')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const horario = new TextInputBuilder()
            .setCustomId('horario')
            .setLabel('Horario disponible (indica hora, día y país)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nombreIC),
            new ActionRowBuilder().addComponents(telefonoIC),
            new ActionRowBuilder().addComponents(motivo),
            new ActionRowBuilder().addComponents(horario)
        );

        await interaction.showModal(modal);

        // 2. Esperar la respuesta del usuario
        const submitted = await interaction.awaitModalSubmit({
            time: 5 * 60 * 1000,
            filter: i => i.user.id === interaction.user.id && i.customId === 'formularioCitaMedica',
        }).catch(() => null);

        if (!submitted) return;

        // 3. Obtener los valores ingresados
        const nombreICValue = submitted.fields.getTextInputValue('nombreIC');
        const telefonoICValue = submitted.fields.getTextInputValue('telefonoIC');
        const motivoValue = submitted.fields.getTextInputValue('motivo');
        const horarioValue = submitted.fields.getTextInputValue('horario');

        // 4. Crear canal privado
        const ticketChannel = await interaction.guild.channels.create({
            name: `cita-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402500397259559004', // ID de la categoría
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        });

        // 5. Crear embed con la información
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📅  SOLICITUD DE CITA MÉDICA')
            .setDescription(`Solicitud enviada por <@${interaction.user.id}>`)
            .addFields(
                { name: 'Nombre IC:', value: nombreICValue },
                { name: 'Teléfono IC:', value: telefonoICValue },
                { name: 'Motivo de la consulta:', value: motivoValue },
                { name: 'Horario disponible:', value: horarioValue }
            )
            .setFooter({
                text: 'Gracias por tu paciencia',
                iconURL: interaction.guild.iconURL({ dynamic: true }),
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

        // 7. Confirmar al usuario
        await submitted.reply({
            content: `✅ Ticket creado correctamente en <#${ticketChannel.id}>.`,
            ephemeral: true,
        });
    },
};

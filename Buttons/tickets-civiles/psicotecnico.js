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
    data: {
        name: 'psicotecnico',
    },

    async execute(interaction) {
        // 1. Crear el formulario modal
        const modal = new ModalBuilder()
            .setCustomId('formularioPsicotecnico')
            .setTitle('Evaluación Psicotécnica 🧠 ');

        // Inputs del formulario
        const nombreIC = new TextInputBuilder()
            .setCustomId('nombreIC')
            .setLabel('Nombre IC')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const edadIC = new TextInputBuilder()
            .setCustomId('edadIC')
            .setLabel('Edad IC')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const telefonoIC = new TextInputBuilder()
            .setCustomId('telefonoIC')
            .setLabel('Número de teléfono IC')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const disponibilidad = new TextInputBuilder()
            .setCustomId('disponibilidad')
            .setLabel('Horario disponible (indica hora, día y país)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const antecedentes = new TextInputBuilder()
            .setCustomId('antecedentes')
            .setLabel('¿Tu PJ tiene antecedentes?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // Discord permite máximo 5 componentes en un modal
        modal.addComponents(
            new ActionRowBuilder().addComponents(nombreIC),
            new ActionRowBuilder().addComponents(edadIC),
            new ActionRowBuilder().addComponents(telefonoIC),
            new ActionRowBuilder().addComponents(disponibilidad),
            new ActionRowBuilder().addComponents(antecedentes)
        );

        // 2. Mostrar el modal
        await interaction.showModal(modal);

        // 3. Esperar respuesta del usuario
        const submitted = await interaction.awaitModalSubmit({
            time: 8 * 60 * 1000, // 8 minutos
            filter: i => i.user.id === interaction.user.id && i.customId === 'formularioPsicotecnico',
        }).catch(() => null);

        if (!submitted) return;

        // 4. Obtener respuestas
        const nombreICValue = submitted.fields.getTextInputValue('nombreIC');
        const edadICValue = submitted.fields.getTextInputValue('edadIC');
        const telefonoICValue = submitted.fields.getTextInputValue('telefonoIC');
        const disponibilidadValue = submitted.fields.getTextInputValue('disponibilidad');
        const antecedentesValue = submitted.fields.getTextInputValue('antecedentes');

        // 5. Crear canal privado para el ticket
        const ticketChannel = await interaction.guild.channels.create({
            name: `psicotecnico-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402500686075265077', // Cambia por la ID de la categoría real
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

        // 6. Crear embed con la info de la solicitud
        const embed = new EmbedBuilder()
            .setColor('#ff4d4d')
            .setTitle('🧠  SOLICITUD DE EVALUACIÓN PSICOTÉCNICA')
            .setDescription(`Solicitud enviada por <@${interaction.user.id}>**`)
            .addFields(
                { name: 'Nombre IC:', value: nombreICValue },
                { name: 'Edad IC:', value: edadICValue },
                { name: 'Número de teléfono IC:', value: telefonoICValue },
                { name: 'Disponibilidad horaria:', value: disponibilidadValue },
                { name: '¿Tiene antecedentes IC?', value: antecedentesValue }
            )
            .setFooter({
                text: 'Departamento Psicológica - LSMD',
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

        // 7. Confirmar al usuario que se creó el ticket
        await submitted.reply({
            content: `✅ Ticket para evaluación psicotécnica creado en <#${ticketChannel.id}>.`,
            ephemeral: true,
        });
    },
};

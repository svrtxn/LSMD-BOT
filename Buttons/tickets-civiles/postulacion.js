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
        name: 'postulacion',
    },

    async execute(interaction) {
        // 1. Crear el formulario
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

        // Modal sólo acepta 5 componentes
        modal.addComponents(
            new ActionRowBuilder().addComponents(nombreIC),
            new ActionRowBuilder().addComponents(edadOOC),
            new ActionRowBuilder().addComponents(edadIC),
            new ActionRowBuilder().addComponents(ilegal),
            new ActionRowBuilder().addComponents(experiencia)
        );

        // 2. Mostrar modal
        await interaction.showModal(modal);

        // 3. Esperar la respuesta del usuario
        const submitted = await interaction.awaitModalSubmit({
            time: 5 * 60 * 1000,
            filter: i => i.user.id === interaction.user.id && i.customId === 'formularioPostulacion',
        }).catch(() => null);

        if (!submitted) return;

        // 4. Obtener las respuestas
        const nombreICValue = submitted.fields.getTextInputValue('nombreIC');
        const edadOOCValue = submitted.fields.getTextInputValue('edadOOC');
        const edadICValue = submitted.fields.getTextInputValue('edadIC');
        const ilegalValue = submitted.fields.getTextInputValue('ilegal');
        const experienciaValue = submitted.fields.getTextInputValue('experiencia');

        // 5. Crear canal
        const ticketChannel = await interaction.guild.channels.create({
            name: `postulacion-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1402500662624911510', // reemplaza con tu ID de categoría
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

        // 6. Crear embed con respuestas
        const embed = new EmbedBuilder()
            .setColor('#28a745')
            .setTitle('📋 POSTULACIÓN A L.S.M.D')
            .setDescription(`Formulario completado por <@${interaction.user.id}>**`)
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
        // Enviar embed al canal creado mencionando al usuario
        await ticketChannel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [cerrarButton], });

        // 7. Confirmar al usuario
        await submitted.reply({
            content: `✅ ¡Formulario enviado! Tu ticket fue creado en <#${ticketChannel.id}>.`,
            ephemeral: true,
        });
    },
};

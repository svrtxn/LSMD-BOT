const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sams')
        .setDescription('Envia sams.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const rolesTexto = `# 📢 Reportes SAMS

Aquí los integrantes del equipo SAMS podrán dejar reportes relacionados con:

× Evasión de rol médico.
× Faltas a la normativa del hospital.
× Conductas inapropiadas dentro del rol médico.

### ⚠ Importante:

× Incluye siempre el ID del jugador involucrado.
× Describe brevemente la situación observada.
× Si es posible, adjunta capturas o evidencia.

🔒 Toda la información compartida aquí será revisada por la jefatura SAMS y el Staff de DistritoX de *manera confidencial.*
`;

        try {
            const partes = rolesTexto.match(/[\s\S]{1,1900}/g);

            for (const parte of partes) {
                await interaction.channel.send(parte);
            }

            await interaction.reply({ 
                content: '✅ Mensaje enviado correctamente.', 
                flags: MessageFlags.Ephemeral 
            });

            const logChannel = await interaction.guild.channels.fetch('1402480570604453930').catch(() => null);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Mensaje personalizado enviado')
                    .addFields(
                        { name: 'Canal', value: `<#${interaction.channel.id}>`, inline: true },
                        { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

        } catch (error) {
            console.error(error);

            if (!interaction.replied) {
                await interaction.reply({ 
                    content: '❌ Hubo un error al enviar el mensaje.', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }
    }
};

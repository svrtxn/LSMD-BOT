const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reportes')
        .setDescription('Muestra las instrucciones para realizar reportes SAMS.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('📢 Reportes SAMS')
                .setDescription(`
Aquí los integrantes del equipo **SAMS** podrán dejar reportes relacionados con:

× Evasión de rol médico.  
× Faltas a la normativa del hospital.  
× Conductas inapropiadas dentro del rol médico.  

⚠ **Importante:**  
× Incluye siempre el **ID del jugador** involucrado.  
× Describe brevemente la situación observada.  
× Si es posible, adjunta **capturas o evidencia**.  

🔒 Toda la información compartida aquí será revisada por la **jefatura SAMS** y el **Staff de DistritoX** de manera confidencial.
                `)
                .setFooter({ text: 'San Andreas Medical Service | Distrito X' })
                .setTimestamp();

            await interaction.channel.send({ embeds: [embed] });

            await interaction.reply({ 
                content: '✅ Instrucciones de reportes enviadas correctamente.', 
                flags: MessageFlags.Ephemeral 
            });

            const logChannel = await interaction.guild.channels.fetch('1402480570604453930').catch(() => null);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('📜 Reportes SAMS enviados')
                    .addFields(
                        { name: 'Canal', value: `<#${interaction.channel.id}>`, inline: true },
                        { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            }

        } catch (error) {
            console.error(error);

            if (!interaction.replied) {
                await interaction.reply({ 
                    content: '❌ Hubo un error al enviar las instrucciones de reportes.', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }
    }
};

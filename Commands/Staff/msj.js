const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('msj')
        .setDescription('Envía un mensaje personalizado en este canal.')
        .addStringOption(option =>
            option.setName('contenido')
                .setDescription('El contenido del mensaje (puede ser largo)')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const contenido = interaction.options.getString('contenido');

        try {
            
            const partes = contenido.match(/[\s\S]{1,1900}/g); 

            for (const parte of partes) {
                await interaction.channel.send(parte);
            }

    
            await interaction.reply({ content: '✅ Mensaje enviado correctamente.', flags: MessageFlags.Ephemeral });

            const logChannel = await interaction.guild.channels.fetch('1402480570604453930').catch(() => null);

            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('📨 Mensaje enviado')
                    .addFields(
                        { name: 'Canal', value: `<#${interaction.channel.id}>`, inline: true },
                        { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Vista previa', value: contenido.slice(0, 200) + (contenido.length > 200 ? '...' : '') }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

        } catch (error) {
            console.error(error);

            if (!interaction.replied) {
                await interaction.reply({ content: '❌ Hubo un error al enviar el mensaje.', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.followUp({ content: '❌ Hubo un error al enviar el mensaje.', flags: MessageFlags.Ephemeral });
            }
        }
    }
};

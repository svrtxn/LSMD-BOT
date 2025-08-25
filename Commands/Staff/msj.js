const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('msj')
        .setDescription('Envía un mensaje personalizado en este canal.')
        .addStringOption(option =>
            option.setName('contenido')
                .setDescription('El contenido del mensaje')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const contenido = interaction.options.getString('contenido');

        try {
            await interaction.channel.send(contenido);

            await interaction.reply({ content: '✅ Mensaje enviado.', ephemeral: true });

            // Enviar log
            const logChannel = await interaction.guild.channels.fetch('1402480570604453930');
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('📨 Mensaje enviado')
                    .addFields(
                        { name: 'Canal', value: interaction.channel.name, inline: true },
                        { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Contenido', value: contenido }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Hubo un error al enviar el mensaje.', ephemeral: true });
        }
    }
};

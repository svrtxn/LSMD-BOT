const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Eliminar mensajes del canal')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes a eliminar')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(99)
        )
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario del que se eliminarán los mensajes')
        )
        .setDefaultMemberPermissions(0),

    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');
        const usuario = interaction.options.getUser('usuario');

        const mensajes = await interaction.channel.messages.fetch();

        try {
            let mensajesEliminados;
            if (usuario) {
                let i = 0;
                mensajesEliminados = mensajes.filter((message) => {
                    if (message.author.id === usuario.id && i < cantidad) {
                        i++;
                        return true;
                    }
                    return false;
                });
            } else {
                mensajesEliminados = mensajes.first(cantidad);
            }

            const eliminados = await interaction.channel.bulkDelete(mensajesEliminados, true);

            await interaction.reply({
                content: usuario 
                    ? `✅ Se han eliminado ${eliminados.size} mensajes del usuario ${usuario.tag}.`
                    : `✅ Se han eliminado ${eliminados.size} mensajes.`,
                ephemeral: true
            });

            // Enviar log
            const logChannel = await interaction.guild.channels.fetch('1402480570604453930');
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🗑️ Mensajes eliminados')
                    .addFields(
                        { name: 'Canal', value: interaction.channel.name, inline: true },
                        { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Cantidad eliminada', value: `${eliminados.size}` },
                        { name: 'Objetivo', value: usuario ? usuario.tag : 'Todos' }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

        } catch (err) {
            console.error(err);
            await interaction.reply({ content: '❌ Hubo un error al eliminar los mensajes.', ephemeral: true });
        }
    }
};

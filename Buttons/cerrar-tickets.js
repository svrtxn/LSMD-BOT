const { ButtonInteraction, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');

module.exports = {
    data: {
        name: 'cerrar-ticket',
    },

    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: '❌ Este botón solo funciona dentro de un canal de texto.', ephemeral: true });
        }

        const logsChannelId = '1402477166100353166'; // Cambia por el canal donde guardas los transcripts
        const logsChannel = interaction.guild.channels.cache.get(logsChannelId);
        if (!logsChannel) {
            return interaction.reply({ content: '❌ No se pudo encontrar el canal de logs.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        // Generar transcript
        const transcript = await createTranscript(interaction.channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${interaction.channel.name}.html`,
        });

        // Obtener fecha y hora actual (hora del servidor)
        const fechaCierre = new Date();
        const fechaLegible = `<t:${Math.floor(fechaCierre.getTime() / 1000)}:F>`; // formato Discord timestamp

        // Crear embed con detalles del cierre
        const embed = new EmbedBuilder()
            .setColor('#ff4d4d')
            .setTitle('📁 Ticket Cerrado')
            .setDescription(`El ticket **${interaction.channel.name}** fue cerrado.`)
            .addFields(
                { name: '👤 Cerrado por', value: `<@${interaction.user.id}>`, inline: true },
                { name: '🕒 Fecha de cierre', value: fechaLegible, inline: true },
            )
            .setFooter({ text: `ID del canal: ${interaction.channel.id}` });

        // Enviar primero el embed
        await logsChannel.send({ embeds: [embed] });

        // Luego enviar el archivo transcript
        await logsChannel.send({ files: [transcript] });

        // Confirmar al usuario y eliminar canal luego de unos segundos
        await interaction.editReply({ content: '✅ El ticket fue cerrado correctamente. El canal se eliminará en 5 segundos.' });

        setTimeout(() => {
            interaction.channel.delete().catch(console.error);
        }, 5000);
    },
};

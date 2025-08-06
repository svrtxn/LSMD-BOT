const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
            // Envía el mensaje al canal donde se ejecutó el comando
            await interaction.channel.send(contenido);

            // Responde al usuario que se envió (ephemeral = solo él lo ve)
            await interaction.reply({ content: '✅ Mensaje enviado.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Hubo un error al enviar el mensaje.', ephemeral: true });
        }
    }
};

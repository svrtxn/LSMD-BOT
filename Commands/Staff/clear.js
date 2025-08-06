const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Eliminar mensajes del canal')
        .addIntegerOption((option) =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes a eliminar')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(99)
        )
        .addUserOption((option) =>
            option.setName('usuario')
                .setDescription('Usuario del que se eliminarán los mensajes')
        )
        .setDefaultMemberPermissions(0),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const cantidad = interaction.options.getInteger('cantidad');
        const usuario = interaction.options.getUser('usuario');

        const mensajes = await interaction.channel.messages.fetch();
        
        if (usuario) {
            let i = 0;
            const mensajesEliminados = mensajes.filter((message) => {
                if (message.author.id === usuario.id && i < cantidad) {
                    i++;
                    return true;
                }
                return false;
            });

            await interaction.channel.bulkDelete(mensajesEliminados, true)
                .then((message) => {
                    interaction.reply({
                        content: `✅ Se han eliminado ${message.size} mensajes del usuario ${usuario.tag}.`,
                        ephemeral: true
                    });
                })
                .catch((err) => {
                    console.error(err);
                    interaction.reply({
                        content: '❌ Hubo un error al eliminar los mensajes.',
                        ephemeral: true
                    });
                });

        } else {
            await interaction.channel.bulkDelete(cantidad, true)
                .then((message) => {
                    interaction.reply({
                        content: `✅ Se han eliminado ${message.size} mensajes.`,
                        ephemeral: true
                    });
                })
                .catch((err) => {
                    console.error(err);
                    interaction.reply({
                        content: '❌ Hubo un error al eliminar los mensajes.',
                        ephemeral: true
                    });
                });
        }
    }
};

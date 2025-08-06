const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bing')
        .setDescription('Responde con bing bong'),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.reply({
            content: 'bing bong!',
            content: 'https://open.spotify.com/album/7m6elVzm04Fd2FdKTVAolu?si=SWuH88H1SZq2ZtsEBXxtTw',
        });
    }
};

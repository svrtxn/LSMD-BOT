const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Envía un embed personalizado en este canal.')
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('Título del embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripción del embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color del embed')
                .setChoices(
                    { name: 'Rojo', value: '#FF0000' },
                    { name: 'Verde', value: '#00FF00' },
                    { name: 'Azul', value: '#0000FF' }
                ))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('Texto del pie de página del embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('imagen')
                .setDescription('URL de una imagen para el embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('URL de una miniatura para el embed')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const titulo = interaction.options.getString('titulo');
        const descripcion = interaction.options.getString('descripcion');
        const color = interaction.options.getString('color') || '#0099ff';
        const footer = interaction.options.getString('footer');
        const imagen = interaction.options.getString('imagen');
        const thumbnail = interaction.options.getString('thumbnail');

        if (descripcion.length > 2048) {
            return interaction.reply({
                content: '❌ La descripción no puede exceder los 2048 caracteres.',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setDescription(descripcion)
            .setColor(color);

        if (footer) embed.setFooter({ text: footer });
        if (imagen) embed.setImage(imagen);
        if (thumbnail) embed.setThumbnail(thumbnail);

        await interaction.channel.send({ embeds: [embed] });

        await interaction.reply({
            content: '✅ Embed enviado correctamente.',
            ephemeral: true
        });
    }
};

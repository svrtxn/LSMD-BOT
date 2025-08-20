const { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
 } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('timeout a un usuario')
        .setDefaultMemberPermissions(PermissionFlagsBits.timeoutMembers) 
        .addUserOption((option) => 
            option.setName('target')
                .setDescription('Usuario a timeout')
                .setRequired(true)
        )
        .addIntegerOption((option) => 
            option.setName('duracion')
                .setDescription('Duración del timeout en segundos')
                .setRequired(true)
        )
        .addStringOption((option) => 
            option.setName('razon')
                .setDescription('Razón del timeout')
        ),


    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        const { guild } = interaction;
        const duracion = interaction.options.getInteger('duracion');
        const reason = interaction.options.getString('razon') || 'No se proporcionó razón';

        const member = await interaction.guild.members.fetch(user.id).catch(console.error); 

        if (!member) {
            return interaction.reply({ content: '❌ Usuario no encontrado en el servidor.', ephemeral: true });
        }
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: '❌ No puedes darte timeout a ti mismo.', ephemeral: true });
        }
        if (user.id === client.user.id) {
            return interaction.reply({ content: '❌ No puedes darle timeout al bot.', ephemeral: true });
        }
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: '❌ No puedes darle timeout a un usuario con un rol igual o superior al tuyo.', ephemeral: true });
        }
        if (!member.kickable) {
            return interaction.reply({ content: '❌ No tengo permisos para darle timeout a este usuario.', ephemeral: true });
        }
        if (duracion < 1 || duracion > 2419200) { // 28 días en segundos
            return interaction.reply({ content: '❌ La duración debe ser entre 1 segundo y 28 días (2419200 segundos).', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) || 'https://i.postimg.cc/C5JNX18p/LOGO-EMS.png' })
            .setColor('#FF0000')
            .setTitle('Usuario Timeout')
            .setDescription(`**Usuario:** ${user.tag} (${user.id})\n**Razón:** ${reason}`)
            .setTimestamp()
            .addFields({ name: 'Duración', value: `${duracion} minutos`, inline: true })
            .setFooter({ text: `Timeout por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
            

        await member.timeout(duracion * 60 * 1000 ).catch(console.error);

        return interaction.reply({ embeds: [embed] });
    },
};

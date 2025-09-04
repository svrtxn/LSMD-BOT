const { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
 } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banear a un usuario')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) 
        .addUserOption((option) => 
            option.setName('target')
                  .setDescription('Usuario a banear')
                  .setRequired(true)
        )
        .addStringOption((option) => 
            option.setName('razon')
                  .setDescription('Razón del baneo')
        ),

    /**a
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('target');
        const { guild } = interaction;
        const reason = interaction.options.getString('razon') || 'No se proporcionó razón';

        const member = await interaction.guild.members.fetch(user.id).catch(console.error); 

        if (!member) {
            return interaction.reply({ content: '❌ Usuario no encontrado en el servidor.', ephemeral: true });
        }
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: '❌ No puedes banearte a ti mismo.', ephemeral: true });
        }
        if (user.id === client.user.id) {
            return interaction.reply({ content: '❌ No puedes banear al bot.', ephemeral: true });
        }
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({ content: '❌ No puedes banear a un usuario con un rol igual o superior al tuyo.', ephemeral: true });
        }
        if (!member.kickable) {
            return interaction.reply({ content: '❌ No tengo permisos para banear a este usuario.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) || 'https://i.postimg.cc/C5JNX18p/LOGO-EMS.png' })
            .setColor('#FF0000')
            .setTitle('Usuario Baneado')
            .setDescription(`**Usuario:** ${user.tag} (${user.id})\n**Razón:** ${reason}`)
            .setTimestamp()
            .setFooter({ text: `Baneado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        await member.ban({deleteMessageSeconds: 60, reason: razon}).catch(console.error);

        return interaction.reply({ embeds: [embed] });
    },
};

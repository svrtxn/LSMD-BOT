const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sams')
        .setDescription('Envia sams.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const rolesTexto = `# :airplane_arriving: BIENVENIDOS AL DISCORD DEL SAN ANDREA'S MEDICAL SERVICES

¡Hola y bienvenido/a al Servidor del San Andreas Medical Services – Distrito X! :stethoscope:
Aquí encontrarás todo lo necesario para mantenerte informado, participar en actividades y formar parte de nuestra comunidad.

## :pushpin:﹒ᴘʀɪᴍᴇʀᴏꜱ ᴘᴀꜱᴏꜱ

× Cambia tu apodo por tu Nombre y Apellido (IC) para postular o ser atendido.
× Lee con atención la sección de https://discord.com/channels/1412883873615839262/1412906386748084265 y selecciona el asunto que mas se ajuste a tus necesidades.
× Evitar spam o flood 
× Prohibido metagaming → El ver la lista de miembros o canales del Discord no otorga conocimiento IC sobre la institución.

:warning: Únicamente la información publicada en el canal ⁠https://discord.com/channels/1412883873615839262/1412911239272861899 puede considerarse válida IC para la ciudadanía.

## :receipt:﹒ᴇɴ ᴇꜱᴛᴇ ꜱᴇʀᴠɪᴅᴏʀ ᴘᴏᴅʀᴀꜱ:

:ambulance: Solicitar atención o hacer consultas.
:loudspeaker: Estar al tanto de anuncios, eventos y actualizaciones.
:stethoscope: Si formas parte del SAMS, acceder a toda la información interna del hospital.`;

        try {
            const partes = rolesTexto.match(/[\s\S]{1,1900}/g);

            for (const parte of partes) {
                await interaction.channel.send(parte);
            }

            await interaction.reply({ 
                content: '✅ Mensaje enviado correctamente.', 
                flags: MessageFlags.Ephemeral 
            });

            const logChannel = await interaction.guild.channels.fetch('1402480570604453930').catch(() => null);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Mensaje personalizado enviado')
                    .addFields(
                        { name: 'Canal', value: `<#${interaction.channel.id}>`, inline: true },
                        { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

        } catch (error) {
            console.error(error);

            if (!interaction.replied) {
                await interaction.reply({ 
                    content: '❌ Hubo un error al enviar el mensaje.', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }
    }
};

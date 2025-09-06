const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('normativas')
        .setDescription('Muestra las normativas establecidas por Distrito X.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            // Embed de normativas
            const normativasEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('📖 Normativas de Distrito X')
                .setDescription(`
Todos los miembros deben **seguir las normativas establecidas por Distrito X**.  

🔗 Revisa el reglamento completo aquí:  
[📌 Normativas Distrito X - SAMS](https://distritox.gitbook.io/distritox/facciones/sams)
                `)
                .setFooter({ text: 'San Andreas Medical Service | Distrito X' })
                .setTimestamp();

            // Paso 1: Imagen como adjunto (grande)
            const attachment = new AttachmentBuilder('https://i.postimg.cc/L5JWtWT8/SAMS-FOTO.png');
            await interaction.channel.send({ files: [attachment] });

            // Paso 2: Mensaje de bienvenida
            await interaction.channel.send({
                content: `
# :airplane_arriving: BIENVENIDOS AL DISCORD DEL SAN ANDREA'S MEDICAL SERVICES

¡Hola y bienvenido/a al Servidor del San Andreas Medical Services – Distrito X! :stethoscope:
Aquí encontrarás todo lo necesario para mantenerte informado, participar en actividades y formar parte de nuestra comunidad.

## :pushpin:﹒ᴘʀɪᴍᴇʀᴏꜱ ᴘᴀꜱᴏꜱ

× Cambia tu apodo por tu Nombre y Apellido (IC) para postular o ser atendido.
× Lee con atención la sección de https://discord.com/channels/1412883873615839262/1412906386748084265 y selecciona el asunto que más se ajuste a tus necesidades.
× Evitar spam o flood 
× Prohibido metagaming → El ver la lista de miembros o canales del Discord no otorga conocimiento IC sobre la institución.

:warning: Únicamente la información publicada en el canal ⁠https://discord.com/channels/1412883873615839262/1412911239272861899 puede considerarse válida IC para la ciudadanía.

## :receipt:﹒ᴇɴ ᴇꜱᴛᴇ ꜱᴇʀᴠɪᴅᴏʀ ᴘᴏᴅʀᴀꜱ:

:ambulance: Solicitar atención o hacer consultas.  
:loudspeaker: Estar al tanto de anuncios, eventos y actualizaciones.  
:stethoscope: Si formas parte del SAMS, acceder a toda la información interna del hospital.  

                `
            });

            // Paso 3: Embed normativas
            await interaction.channel.send({ embeds: [normativasEmbed] });

            // Respuesta al comando
            await interaction.reply({
                content: '✅ Mensaje de bienvenida y normativas enviados correctamente.',
                flags: MessageFlags.Ephemeral
            });

            // Log en canal específico
            const logChannel = await interaction.guild.channels.fetch('1402480570604453930').catch(() => null);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('📜 Mensaje enviado')
                    .addFields(
                        { name: 'Canal', value: `<#${interaction.channel.id}>`, inline: true },
                        { name: 'Usuario', value: `<@${interaction.user.id}>`, inline: true }
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
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

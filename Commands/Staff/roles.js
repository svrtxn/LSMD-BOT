const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Muestra la lista de roles médicos del hospital.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const rolesTexto = `
👨‍⚖️ **1. Director**
* Máxima autoridad del hospital.
* Define protocolos generales, aprueba contrataciones y gestiona pagos del personal.
* Representa al hospital ante el gobierno, organizaciones y otras facciones.
* Supervisa a todo el staff de forma indirecta.

👩‍⚖️ **2. Subdirector**
* Sustituye al Director en su ausencia.
* Supervisa la operatividad interna del hospital.
* Resuelve conflictos internos o toma decisiones si hay situaciones críticas.
* Autoriza permisos especiales (traslados, investigaciones, etc).
* Realiza pruebas de ascenso y entrevistas de ingreso.

🧠 **3. Encargado de Departamento (Neuro, Cardio, Psico, etc)**
* Lidera un área médica especializada.
* Crea protocolos y dirige el enfoque clínico de su especialidad.
* Supervisa a médicos especialistas y generales que trabajan en su área.
* Es responsable de diagnósticos complejos y decisiones de tratamiento.

🔪 **4. Médico Cirujano**
* Realiza procedimientos quirúrgicos especializados (cardiocirugía, neurocirugía, etc).
* Debe realizar informe de cirugías y reportarlas al Encargado de Departamento.
* Puede apoyar en urgencias graves.
* Tiene peso clínico alto, pero se limita a casos quirúrgicos.

🩻 **5. Médico Especialista**
* Tiene una especialización (cardiología, neurología, traumatología, etc).
* Recibe derivaciones de médicos generales.
* Atiende consultas de su área de especialidad.
* Debe realizar informe de atenciones y cirugías, y reportarlas a su Encargado.
* Entrena a médicos generales interesados en especializarse.

🩺 **6. Médico General**
* Atiende consultas generales y cuadros clínicos complejos.
* Puede hacer cirugías generales o asistir en cirugías de mayor complejidad.
* Debe realizar informes de atenciones y cirugías.
* Deriva a especialistas cuando el caso lo amerita.
* Puede supervisar a residentes, internos, enfermeros y paramédicos.

🧑‍🎓 **7. Médico Residente**
* Atiende consultas generales, diagnóstico y tratamiento de enfermedades comunes.
* Es médico graduado.
* Puede realizar cirugías generales bajo supervisión.
* Debe realizar informes de atenciones y cirugías.
* Participa en guardias y entrena a paramédicos o enfermeros.

👨‍⚕️ **8. Interno**
* Se encarga de pacientes internados, post-operatorios y exámenes de laboratorio.
* Es estudiante en último año de medicina.
* Ideal para fichaje, evolución de pacientes y apoyo en sala.
* No realiza diagnósticos.

🚑 **9. Paramédico**
* Responde a emergencias fuera del hospital (nuevos ingresos deben ir acompañados).
* Realiza estabilización, RCP, traslado y primeros auxilios.
* Puede acompañar a personal médico para aprender en terreno.
* Al llegar al hospital, hace el traspaso al personal médico.
* No realiza diagnósticos.`;


        try {
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('📋 RANGOS MÉDICOS DEL HOSPITAL   ')
                .setDescription(rolesTexto)
                .setFooter({ text: 'San Andreas Medical Service | Distrito X' })
                .setTimestamp();

            await interaction.channel.send({ embeds: [embed] });

            await interaction.reply({ 
                content: '✅ Lista de roles enviada correctamente.', 
                flags: MessageFlags.Ephemeral 
            });

            const logChannel = await interaction.guild.channels.fetch('1402480570604453930').catch(() => null);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('📜 Roles médicos enviados')
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
                    content: '❌ Hubo un error al enviar la lista de roles.', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }
    }
};

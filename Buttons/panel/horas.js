const { EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  id: "horas",
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    const filePath = path.join(__dirname, "../../data/serviciosActivos.json");

    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');
    let servicios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let usuario = servicios.find(s => s.userId === userId);

    if (!usuario || !usuario.historial || usuario.historial.length === 0) {
      return interaction.reply({ content: "❌ No hay registros de servicio finalizados para calcular horas.", ephemeral: true });
    }

    // Calcular tiempo total
    let totalMs = 0;
    for (const periodo of usuario.historial) {
      const inicio = new Date(periodo.inicio).getTime();
      const fin = new Date(periodo.fin).getTime();
      totalMs += fin - inicio;
    }

    // Convertir ms a horas y minutos
    const totalMin = Math.floor(totalMs / 60000);
    const horas = Math.floor(totalMin / 60);
    const minutos = totalMin % 60;

    const embed = new EmbedBuilder()
      .setColor('#3498db')
      .setTitle('⏱️ Horas de Servicio')
      .setDescription(`**Usuario:** ${username}\n**Tiempo total acumulado:** ${horas}h ${minutos}m`);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};

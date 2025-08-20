const { EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  id: "salir-servicio",
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const horaSalida = new Date().toISOString();

    const filePath = path.join(__dirname, "../../data/serviciosActivos.json");

    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');

    let servicios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const index = servicios.findIndex(s => s.userId === userId);
    if (index === -1) {
      return interaction.reply({ content: "❌ No estabas en servicio.", ephemeral: true });
    }

    const usuario = servicios[index];

    if (!usuario.historial) usuario.historial = [];
    usuario.historial.push({
      inicio: usuario.entrada, // hora de entrada
      fin: horaSalida          // hora de salida
    });

    delete usuario.entrada;

    servicios[index] = usuario;
    fs.writeFileSync(filePath, JSON.stringify(servicios, null, 2));

    // Enviar log al canal de logs
    const canalLogs = interaction.guild.channels.cache.get('1402774735099658401'); // ID del canal de logs
    if (canalLogs && canalLogs.isTextBased()) {
      const embedLog = new EmbedBuilder()
        .setColor('#e74c3c')
        .setTitle('🔴 Salida de Servicio')
        .setDescription(`**Usuario:** ${username}\n**Día y Hora:** ${new Date(horaSalida).toLocaleString('es-CL', { timeZone: 'America/Santiago' })}`);
      canalLogs.send({ embeds: [embedLog] });
    }

    const canalPanel = interaction.guild.channels.cache.get('1402774771732844605'); // ID del canal del panel de servicios
    if (canalPanel && canalPanel.isTextBased()) {
      const activos = servicios.filter(s => s.entrada); 
      const usuariosActivos = activos.map(s => `• <@${s.userId}>`).join('\n') || 'Ninguno';

      const embedPanel = new EmbedBuilder()
        .setColor('#e74c3c')
        .setTitle('🩺 Panel de Servicios Activos')
        .setDescription(`**Usuarios actualmente en servicio:**\n${usuariosActivos}`)
        .setFooter({ text: `Total conectados: ${activos.length} • Marcador de turnos - Complex RP` });

      // Limpiar últimos mensajes
      const ultimos = await canalPanel.messages.fetch({ limit: 5 });
      ultimos.forEach(m => m.delete().catch(() => {}));

      canalPanel.send({ embeds: [embedPanel] });
    }

    await interaction.reply({ content: "✅ Has salido de servicio.", ephemeral: true });
  }
};

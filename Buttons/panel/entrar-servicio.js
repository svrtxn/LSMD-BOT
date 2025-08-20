const { EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  id: "entrar-servicio",
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const hora = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    const filePath = path.join(__dirname, "../../data/serviciosActivos.json");

    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');

    let servicios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const usuarioActivo = servicios.find(s => s.userId === userId && s.entrada);
    if (usuarioActivo) {
      return interaction.reply({ content: "❌ Ya estás en servicio.", ephemeral: true });
    }

    let usuario = servicios.find(s => s.userId === userId);
    if (usuario) {
      usuario.entrada = new Date().toISOString();
    } else {
      usuario = { userId, username, entrada: new Date().toISOString(), historial: [] };
      servicios.push(usuario);
    }

    fs.writeFileSync(filePath, JSON.stringify(servicios, null, 2));

    // Enviar log al canal de logs
    const canalLogs = interaction.guild.channels.cache.get('1402774735099658401');   // ID del canal de logs
    if (canalLogs && canalLogs.isTextBased()) {
      const embedLog = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('🟢 Entrada en Servicio')
        .setDescription(`**Usuario:** ${username}\n**Día y Hora:** ${hora}`);
      canalLogs.send({ embeds: [embedLog] });
    }

    // Actualizar embed de panel de servicios 
    const canalPanel = interaction.guild.channels.cache.get('1402774771732844605'); // ID del canal del panel de servicios 
    if (canalPanel && canalPanel.isTextBased()) {
      const usuariosActivos = servicios
        .filter(s => s.entrada)
        .map(s => `• <@${s.userId}>`)
        .join('\n') || 'Ninguno';

      const embedPanel = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('🩺 Panel de Servicios Activos')
        .setDescription(`**Usuarios actualmente en servicio:**\n${usuariosActivos}\n**Total conectados:** ${usuariosActivos === 'Ninguno' ? 0 : servicios.filter(s => s.entrada).length}`)
        .setFooter({ text: `Marcador de turnos` });

      const ultimos = await canalPanel.messages.fetch({ limit: 5 });
      ultimos.forEach(m => m.delete().catch(() => {}));

      canalPanel.send({ embeds: [embedPanel] });
    }

    await interaction.reply({ content: "✅ Has entrado en servicio.", ephemeral: true });
  }
};

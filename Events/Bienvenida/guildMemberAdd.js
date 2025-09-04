const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const { registerFont } = require('canvas');

registerFont("LexendDeca-VariableFont_wght.ttf", { family: "Lexend Deca" });

let background;
(async () => {
    background = await Canvas.loadImage('./fondo.jpg');
})();

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    async execute(member) {
        // Crear canvas
        const canvas = Canvas.createCanvas(1028, 468);
        const ctx = canvas.getContext('2d');

        // Fondo ya precargado
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Avatar
        const avatarX = canvas.width / 2; 
        const avatarY = 180;              
        const avatarRadius = 120;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(
            member.user.displayAvatarURL({ size: 1024, extension: 'png' })
        );
        ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
        ctx.restore();

        // Texto
        ctx.fillStyle = '#0d0d9fff';
        ctx.textAlign = "center";
        ctx.textBaseline = "top"; 
        ctx.font = '50px "Lexend Deca"';
        const textY = avatarY + avatarRadius + 30; 
        ctx.fillText(`Bienvenido/a, ${member.user.username}!`, canvas.width / 2, textY);

        // Attachment
        const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "bienvenida.png" });

        // Enviar al canal
        const channel = member.guild.channels.cache.get('1412883874350104598');
        if (channel) {
            await channel.send({
                content: `¡Bienvenido/a <@${member.id}> 🎉!`,
                files: [attachment]
            });
        }

        // Rol automático
        const role = member.guild.roles.cache.get('1412906657398128732');
        if (role) {
            await member.roles.add(role).catch(console.error);
        }
    }
};

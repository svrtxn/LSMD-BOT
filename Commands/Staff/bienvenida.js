const { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    AttachmentBuilder
} = require('discord.js');

const Canvas = require('canvas');
const { registerFont } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bienvenida')
        .setDescription('Genera una imagen de bienvenida personalizada')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario al que dar la bienvenida')
                .setRequired(false)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        registerFont("LexendDeca-VariableFont_wght.ttf", { family: "Lexend Deca" });

        const target = interaction.options.getUser('usuario') || interaction.user;

        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontsize = 60;

            do {
                ctx.font = `${fontsize -= 2}px "Lexend Deca"`;
            } while (ctx.measureText(text).width > canvas.width - 100);

            return ctx.font;
        };

        const canvas = Canvas.createCanvas(1028, 468);
        const ctx = canvas.getContext('2d');

        // Fondo
        const background = await Canvas.loadImage('./fondo.jpg');
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
            target.displayAvatarURL({ size: 1024, extension: 'png' })
        );
        ctx.drawImage(
            avatar,
            avatarX - avatarRadius,
            avatarY - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
        );
        ctx.restore();

        // Texto 
        ctx.fillStyle = '#0d0d9fff';
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.font = applyText(canvas, `Bienvenido, ${target.username}!`);

        const textY = avatarY + avatarRadius + 30;
        ctx.fillText(`Bienvenido/a, ${target.username}!`, canvas.width / 2, textY);

        const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "bienvenida.png" });
        
        await interaction.reply({ 
            content: `¡Bienvenido/a <@${target.id}> 🎉!`,
            files: [attachment] 
        });
    }
};

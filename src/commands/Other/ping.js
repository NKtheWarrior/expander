const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping command"),
  async execute(interaction, client) {
    await interaction.reply({
      content: `🏓Latency is ${Math.round(client.ws.ping)}ms`,
      ephemeral: true,
    });
    console.log(interaction.user.tag + " Used Ping Command");
  },
};

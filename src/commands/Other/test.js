const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  async execute(interaction, client) {
    if (interaction.user.id === 750296670490722324) {
      await interaction.reply({
        content: "Bot is online",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "You don't have permission to use this command",
        ephemeral: true,
      });
    }
  },
};

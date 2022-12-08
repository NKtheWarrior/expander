const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const getVideoId = require("get-video-id");
const yt = require("usetube");
const video = require("./video");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("thumbnail")
    .setDescription("Grab Thumbnail Of a Video")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Enter url Of the video.")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    const url = getVideoId(interaction.options.getString("url")).id;
    const provider = getVideoId(interaction.options.getString("url")).service;
    const videoVerify = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${url}&key=AIzaSyDtM--gNgmo7ra1ZiI4cGqfcFJYXlpnHPs`
    );
    const maxresdefault = new EmbedBuilder()
      .setTitle("Thumbnail (High Resolution)")
      .setColor([254, 1, 0])

      .setImage(`https://img.youtube.com/vi/${url}/maxresdefault.jpg`)
      .setFooter({
        text: "Requested By " + interaction.user.tag,
        iconURL: interaction.user.avatarURL(),
      })
      .setTimestamp(Date.now());
    const mqdefault = new EmbedBuilder()
      .setTitle("Thumbnail")
      .setColor([254, 1, 0])
      .setImage(`https://img.youtube.com/vi/${url}/mqdefault.jpg`)
      .setFooter({
        text: "Requested By " + interaction.user.tag,
        iconURL: interaction.user.avatarURL(),
      })
      .setTimestamp(Date.now());
    const lowRes = new EmbedBuilder()
      .setTitle("Thumbnail")
      .setColor([254, 1, 0])
      .setDescription(
        `[Click to Open In Browser](https://img.youtube.com/vi/${url}/default.jpg)`
      )
      .setImage(`https://img.youtube.com/vi/${url}/default.jpg`)
      .setFooter({
        text: "Requested By " + interaction.user.tag,
        iconURL: interaction.user.avatarURL(),
      })
      .setTimestamp(Date.now());
    const username = interaction.user.tag;
    const userId = await interaction.user.id;
    // const guild = await interaction.guild.id;
    // const guidName = await interaction.guild.name;
    // const channel = await interaction.channel.id;
    // const channelName = await interaction.channel.name;
    const date = new Date();
    const newCommandUse = {
      username: username,
      userId: userId,
      // guildId: guild,
      // guidName: guidName,
      // channelId: channel,
      // channelName: channelName,
      date: date.toString(),
      command: "thumbnail",
      commandUse: 1,
    };
    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("dl")
          .setLabel("Download Thumbnail")
          .setStyle(ButtonStyle.Secondary)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Open in Browser")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://img.youtube.com/vi/${url}/maxresdefault.jpg`)
      );

    console.log(provider);
    if (url === null) {
      await interaction.reply({
        content: "URL does not contains Video ID. Please provide full URL",
        ephemeral: true,
      });
    } else if (url === undefined) {
      await interaction.reply({
        content: "URL does not contains Video ID. Please provide full URL",
        ephemeral: true,
      });
    } else if (provider != "youtube") {
      await interaction.reply({
        content: "Please Provide a YouTube URL",
        ephemeral: true,
      });
    } else if (!videoVerify.data.items[0]) {
      await interaction.reply({
        content: "Given URL was not found in Server",
        ephemeral: true,
      });
    } else if (url.length === 11) {
      await interaction.reply({
        embeds: [maxresdefault],
        components: [button],
      });

      console.log(interaction.user.tag + " Used Thumbnail Command");
    } else {
      await interaction.reply({ content: "Enter Valid ID", ephemeral: true });
    }
    const collector = interaction.channel.createMessageComponentCollector();
    collector.on("collect", async (i) => {
      await i.reply({
        files: [`https://img.youtube.com/vi/${url}/maxresdefault.jpg`],
      });
      await wait(60000);
      await i.deleteReply();
      console.log(interaction.user.tag + " Used Thumbnail Button Command");
    });
  },
};

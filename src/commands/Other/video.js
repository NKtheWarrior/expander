const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("@discordjs/builders");
const axios = require("axios");
const { ButtonStyle } = require("discord.js");
const getVideoId = require("get-video-id");
const wait = require("node:timers/promises").setTimeout;

require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("video")
    .setDescription("Get information of a video")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Enter url Of the video.")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    const url = getVideoId(interaction.options.getString("url")).id;
    console.log(url);
    const provider = getVideoId(interaction.options.getString("url")).service;
    await interaction.deferReply();
    const videoRes = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=${url}&key=AIzaSyDtM--gNgmo7ra1ZiI4cGqfcFJYXlpnHPs`
    );
    const channelId = videoRes.data.items[0].snippet.channelId;
    // .then((res) => console.log(res.data));
    const chnlRes = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2Cstatistics&id=${channelId}&key=AIzaSyDtM--gNgmo7ra1ZiI4cGqfcFJYXlpnHPs`
    );
    const response = {
      id: videoRes.data.items[0].id,
      title: videoRes.data.items[0].snippet.title,
      views: videoRes.data.items[0].statistics.viewCount,
      upload: new Date(videoRes.data.items[0].snippet.publishedAt),
      likes: videoRes.data.items[0].statistics.likeCount,
      comments: videoRes.data.items[0].statistics.commentCount,
      chnlName: chnlRes.data.items[0].snippet.title,
      subCount: chnlRes.data.items[0].statistics.subscriberCount,
      desc: videoRes.data.items[0].snippet.localized.description,
      chnlIcon: chnlRes.data.items[0].snippet.thumbnails.default.url,
    };
    let description = response.desc;
    if (description > 1000) {
      let description = `${description.slice(0, 1000)}...`;
    }
    const thumbnailEM = new EmbedBuilder()
      .setImage(`https://img.youtube.com/vi/${url}/maxresdefault.jpg`)
      .setColor([254, 0, 1]);
    const videoEM = new EmbedBuilder()
      .setTitle(`${response.title}`)
      .setColor([254, 0, 1])
      .addFields([
        {
          name: `${response.chnlName}`,
          value: `${response.subCount} subscribers`,
        },
        {
          name: "`👀` Views",
          value: `${response.views} Views`,
          inline: true,
        },
        {
          name: "`🟢`Uploaded On",
          value: `${response.upload.toString().slice(4, 18 + 6)} IST`,
          inline: true,
        },
        {
          name: "`👍` Likes",
          value: `${response.likes} Likes`,
          inline: true,
        },
        {
          name: "`💬`Comments",
          value: `${response.comments} Comments`,
          inline: true,
        },
        {
          name: "Description",
          value: `${response.desc.slice(0, 1000)} ...`,
        },
      ])
      .setThumbnail(response.chnlIcon)
      .setFooter({
        iconURL: interaction.user.avatarURL(),
        text: `Requested By ${interaction.user.tag}`,
      })
      .setTimestamp(Date.now());

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Open Video")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://youtu.be/${url}`)
      )
      .addComponents(
        new ButtonBuilder()
          .setLabel("Open Channel")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://youtube.com/channel/${channelId}`)
      );
    if (url === null) {
      await interaction.editReply({
        content: "URL does not contains Video ID. Please provide full URL",
        ephemeral: true,
      });
    } else if (url === undefined) {
      await interaction.editReply({
        content: "URL does not contains Video ID. Please provide full URL",
        ephemeral: true,
      });
    } else if (provider != "youtube") {
      await interaction.editReply({
        content: "Please Provide a YouTube URL",
        ephemeral: true,
      });
    } else if (!videoRes.data.items[0]) {
      await interaction.editReply({
        content: "Given URL was not found in Server",
        ephemeral: true,
      });
    } else if (url.length === 11) {
      await interaction.editReply({
        embeds: [thumbnailEM, videoEM],
        components: [row],
        content: "",
      });
      console.time(interaction.user.tag + " Used video Command");
    } else {
      await interaction.editReply({
        content: "Enter Valid ID",
        ephemeral: true,
      });
    }
  },
};

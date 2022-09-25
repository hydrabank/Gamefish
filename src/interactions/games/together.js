import { SlashCommandBuilder, ChannelType } from "discord.js";

const activities = [
    { name: "YouTube Together", value: "youtube" },
    { name: "Poker Night", value: "poker" },
    { name: "Chess in the Park", value: "chess" },
    { name: "Betrayal.io", value: "betrayal" },
    { name: "Fishington.io", value: "fishing" },
    { name: "Letter Tile", value: "lettertile" },
    { name: "Word Snacks", value: "wordsnacks" },
    { name: "Doodle Crew", value: "doodlecrew" },
    { name: "Awkword", value: "awkword" },
    { name: "Spellcast", value: "spellcast" }
];

const metadata = {
    name: "together", 
    type: "CommandInteraction", 
    proctorOnly: false, 
    dmCommand: false, 
    builder: new SlashCommandBuilder()
        .setDescription(`Use Discord's Together feature to participate in voice chat activities with your friends!`)
        .addStringOption(s => s.setName("activity").setDescription("Select an activity to play").setRequired(true).addChoices(    
            { name: "YouTube Together", value: "youtube" },
            { name: "Poker Night", value: "poker" },
            { name: "Chess in the Park", value: "chess" },
            { name: "Betrayal.io", value: "betrayal" },
            { name: "Fishington.io", value: "fishing" },
            { name: "Letter Tile", value: "lettertile" },
            { name: "Word Snacks", value: "wordsnacks" },
            { name: "Doodle Crew", value: "doodlecrew" },
            { name: "Awkword", value: "awkword" },
            { name: "Spellcast", value: "spellcast" }
    )),
    i18n: { 
        "default": {
            "success": "> **A new __%s__ session is starting in %s!**\n**Click [here](%s) to join!**",
        }
    }
};

async function execute(ctx, interaction) { 
    const activity = activities.find(e => e.value === interaction.options.getString("activity"));
    const channel = interaction.member?.voice?.channel;

    if (!interaction.member?.voice?.channel && !interaction.guild?.members?.voice?.channel) return interaction.reply({ content: "You must be in a voice channel to use this command!", ephemeral: true });
    if (channel.type !== ChannelType.GuildVoice) return interaction.reply({ content: "You must be in a voice channel to use this command!", ephemeral: true });

    await interaction.deferReply({ ephemeral: false });

    const session = await ctx.DiscordTogether.createTogetherCode(channel.id, activity.value);

    const response = metadata.i18n[`${metadata.i18n[interaction.locale] ? interaction.locale : "default"}`].success.replace("%s", activity.name).replace("%s", "<#" + channel.id + ">").replace("%s", session.code);

    await interaction.editReply(response);
};

export { metadata, execute };
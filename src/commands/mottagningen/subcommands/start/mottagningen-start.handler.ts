import {
	ChannelType,
	Colors,
	Guild,
	PermissionFlagsBits,
	Role,
} from "discord.js";
import { GuildChatInputCommandInteraction } from "../../../../shared/types/GuildChatInputCommandType";
import { getRole } from "../../../../shared/utils/roles";
import { getCurrentYearRole } from "../../../../shared/utils/year";
import { clearNollegrupper } from "../../../../db/db";

export const handleMottagningenStart = async (
	interaction: GuildChatInputCommandInteraction
): Promise<void> => {
	interaction.editReply("Starting mottagningen...");
	const guild = interaction.guild;
	guild.roles.fetch();

	const nollanRole = await guild.roles.create({
		name: "nØllan",
		color: "#e980ff",
		mentionable: true,
		hoist: true,
	});

	await getRole(getCurrentYearRole(1), guild)
		.setColor(Colors.Default);

	await Promise.all([
		createNollanCategory(guild, nollanRole),
		setupReceptionRoles(guild),
		clearNollegrupper(),
	]).catch((err) =>
		interaction.editReply(
			`Failed to start mottagningen! Cause given below:\n\`\`\`${err}\`\`\``
		)
	);

	interaction.editReply(
		"Started mottagningen! Watch out for schlem, nØllan is coming."
	);
};

async function createNollanCategory(
	guild: Guild,
	nollanRole: Role
): Promise<void> {
	const category = await guild.channels.create({
		name: "╒═════╣  nØllan  ╠═════╕",
		type: ChannelType.GuildCategory,
		permissionOverwrites: [
			{
				id: guild.id,
				deny: PermissionFlagsBits.ViewChannel,
			},
			{
				id: nollanRole.id,
				allow: PermissionFlagsBits.ViewChannel,
			},
			{
				id: getRole("Mottagare", guild).id,
				allow: PermissionFlagsBits.ViewChannel,
			},
			{
				id: getRole("D-rek", guild).id,
				allow: PermissionFlagsBits.ViewChannel,
			},
			{
				id: getRole("Hypervisor", guild).id,
				allow: PermissionFlagsBits.ViewChannel,
			},
		],
	});

	const announcements = await category.children.create({
		name: "「📣」announcements",
		topic: "Annonsering av evenemang och annat viktigt.",
	});
	announcements.permissionOverwrites.edit(guild.id, {
		SendMessages: false,
		CreatePublicThreads: false,
		CreatePrivateThreads: false,
	});
	announcements.permissionOverwrites.edit(getRole("Mottagare", guild).id, {
		SendMessages: false,
	});

	await category.children.create({
		name: "「💬」allmänt",
		topic: "Allmän diskussion, studierelaterade diskussioner förs i kurskanalerna.",
	});

	await category.children.create({
		name: "「🤡」memes",
		topic: "Memes och citat.",
	});

	await category.children.create({
		name: "「🎧」röst",
		type: ChannelType.GuildVoice,
	});
};

const setupReceptionRoles = async (guild: Guild): Promise<void> => {
	const receptionRoles = [
		"Storasyskon",
		"Dadderiet",
		"Quisineriet",
		"Ekonomeriet",
		"Doqumenteriet",
	];

	receptionRoles.map(async (roleName) => {
		const role = getRole(roleName, guild);
		await role.setHoist(true); // Not separate on member list
		await role.setMentionable(true);
	});

	await getRole("Ordförande", guild).setHoist(false);
	await getRole("dFunk", guild).setHoist(false);
	await getRole("D-rek", guild).setHoist(false);
};

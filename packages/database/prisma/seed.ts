import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
	const passwordHash = await hash("Passw0rd!", 10);

	const learner = await prisma.user.upsert({
		where: { username: "learner1" },
		update: {},
		create: {
			username: "learner1",
			passwordHash,
			roles: ["LEARNER"],
		},
	});

	const existingTraining = await prisma.training.findFirst({
		where: { title: "Testautomatisering Basis" },
	});

	if (existingTraining) {
		console.log(`Seed skipped: training already exists (id=${existingTraining.id}).`);
		console.log(`Seeded learner: username=learner1 password=Passw0rd! (id=${learner.id})`);
		return;
	}

	await prisma.training.create({
		data: {
			title: "Testautomatisering Basis",
			description: "Een introductie tot testautomatisering voor Test Consultants.",
			status: "PUBLISHED",
			level: "Junior",
			language: "nl",
			chapters: {
				create: [
					{
						title: "Introductie",
						order: 1,
						lessons: {
							create: [
								{
									title: "Wat is testautomatisering?",
									order: 1,
									contentType: "TEXT",
									contentBody:
										"Testautomatisering is het gebruik van software om testuitvoering, vergelijking van resultaten en rapportage te automatiseren.",
								},
								{
									title: "Voor- en nadelen",
									order: 2,
									contentType: "TEXT",
									contentBody:
										"Voordelen: snelheid, herhaalbaarheid, regressiedekking. Nadelen: onderhoud, initiele investering, niet alles is te automatiseren.",
								},
							],
						},
					},
					{
						title: "Aan de slag",
						order: 2,
						lessons: {
							create: [
								{
									title: "Testtools kiezen",
									order: 1,
									contentType: "TEXT",
									contentBody:
										"Belangrijke criteria: type applicatie (web, mobile, API), teamvaardigheden, integratie met CI/CD en licentiekosten.",
								},
								{
									title: "Je eerste testscript",
									order: 2,
									contentType: "TEXT",
									contentBody:
										"Begin klein: automatiseer een enkel, stabiel scenario voordat je een volledige regressiesuite opbouwt.",
								},
							],
						},
					},
				],
			},
		},
	});

	console.log(`Seeded learner: username=learner1 password=Passw0rd! (id=${learner.id})`);
	console.log("Seeded training: Testautomatisering Basis (2 chapters x 2 lessons).");
}

void main()
	.catch(error => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(() => {
		void prisma.$disconnect();
	});

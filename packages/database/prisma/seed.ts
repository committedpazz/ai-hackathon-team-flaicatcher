import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const GENERAL_BADGES = [
    { code: "FIRST_STEP", name: "Eerste stap", description: "Eerste training afgerond" },
    { code: "GOOD_START", name: "Goede start", description: "10 punten behaald" },
    { code: "PERSISTENT", name: "Doorzetter", description: "Drie trainingen afgerond" },
    { code: "KNOWLEDGE_BUILDER", name: "Kennisbouwer", description: "Vijf trainingen afgerond" },
    { code: "PERFECTIONIST", name: "Perfectionist", description: "Een toets met 100% afgerond" },
    { code: "LEARNING_PATH_COMPLETE", name: "Leerpad voltooid", description: "Een volledig leerpad afgerond" },
    { code: "CONSISTENT_LEARNER", name: "Consistente leerder", description: "Acht actieve weken op rij" },
];

async function seedBadges(): Promise<void> {
    for (const badge of GENERAL_BADGES) {
        await prisma.badge.upsert({
            where: { code: badge.code },
            update: { name: badge.name, description: badge.description },
            create: badge,
        });
    }
}

async function seedQuiz(trainingId: string): Promise<void> {
    const existingQuiz = await prisma.quiz.findUnique({ where: { trainingId } });
    if (existingQuiz) {
        return;
    }

    await prisma.quiz.create({
        data: {
            trainingId,
            title: "Eindtoets: Testautomatisering Basis",
            passingScorePercentage: 70,
            questions: {
                create: [
                    {
                        text: "Wat is het belangrijkste voordeel van testautomatisering?",
                        order: 1,
                        options: {
                            create: [
                                { text: "Herhaalbaarheid en snelheid", isCorrect: true, order: 1 },
                                { text: "Het vervangt alle handmatige tests volledig", isCorrect: false, order: 2 },
                                { text: "Het kost nooit onderhoud", isCorrect: false, order: 3 },
                            ],
                        },
                    },
                    {
                        text: "Welk criterium is belangrijk bij het kiezen van een testtool?",
                        order: 2,
                        options: {
                            create: [
                                { text: "De kleur van de logo", isCorrect: false, order: 1 },
                                { text: "Integratie met CI/CD", isCorrect: true, order: 2 },
                                { text: "Het aantal downloads op internet", isCorrect: false, order: 3 },
                            ],
                        },
                    },
                    {
                        text: "Wat is een goede eerste stap bij het opbouwen van een testsuite?",
                        order: 3,
                        options: {
                            create: [
                                { text: "Direct de volledige regressiesuite automatiseren", isCorrect: false, order: 1 },
                                { text: "Een enkel, stabiel scenario automatiseren", isCorrect: true, order: 2 },
                                { text: "Wachten tot alle features klaar zijn", isCorrect: false, order: 3 },
                            ],
                        },
                    },
                ],
            },
        },
    });

    await prisma.badge.upsert({
        where: { code: "SKILL_TESTAUTOMATISERING_BASIS" },
        update: { requiredTrainingId: trainingId, minimumScorePercentage: 80 },
        create: {
            code: "SKILL_TESTAUTOMATISERING_BASIS",
            name: "Testautomatisering Basis",
            description: "Training en toets Testautomatisering Basis met minimaal 80% afgerond",
            isSkillBadge: true,
            requiredTrainingId: trainingId,
            minimumScorePercentage: 80,
        },
    });
}

async function main(): Promise<void> {
    const passwordHash = await hash("Passw0rd!", 10);

    await seedBadges();

    const learner = await prisma.user.upsert({
        where: { username: "learner1" },
        update: { passwordHash, roles: ["LEARNER", "TRAINER"] },
        create: {
            username: "learner1",
            passwordHash,
            roles: ["LEARNER", "TRAINER"],
        },
    });

    const ldUser = await prisma.user.upsert({
        where: { username: "ld1" },
        update: { passwordHash, roles: ["LD"] },
        create: {
            username: "ld1",
            passwordHash,
            roles: ["LD"],
        },
    });
    console.log(`Seeded L&D user: username=ld1 password=Passw0rd! (id=${ldUser.id})`);

    const existingTraining = await prisma.training.findFirst({
        where: { title: "Testautomatisering Basis" },
    });

    if (existingTraining) {
        if (existingTraining.createdByUserId !== learner.id) {
            await prisma.training.update({
                where: { id: existingTraining.id },
                data: { createdByUserId: learner.id },
            });
        }
        await seedQuiz(existingTraining.id);
        console.log(`Seed skipped: training already exists (id=${existingTraining.id}).`);
        console.log(`Seeded learner: username=learner1 password=Passw0rd! (id=${learner.id})`);
        return;
    }

    const training = await prisma.training.create({
        data: {
            title: "Testautomatisering Basis",
            description: "Een introductie tot testautomatisering voor Test Consultants.",
            status: "PUBLISHED",
            level: "Junior",
            language: "nl",
            createdByUserId: learner.id,
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

    await seedQuiz(training.id);

    console.log(`Seeded learner: username=learner1 password=Passw0rd! (id=${learner.id})`);
    console.log("Seeded training: Testautomatisering Basis (2 chapters x 2 lessons + eindtoets).");
}

void main()
    .catch(error => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => {
        void prisma.$disconnect();
    });

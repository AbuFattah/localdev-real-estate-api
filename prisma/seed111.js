// Import the PrismaClient from the generated Prisma client
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Seed function to populate your database
async function main() {
  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      username: 'user1',
      password: 'ckjsdh9e2o3i4j', // In a real app, passwords should be hashed
      avatar: 'https://example.com/avatar1.jpg',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      username: 'user2',
      password: 'xkjdh38388329s',
      avatar: 'https://example.com/avatar2.jpg',
    },
  });

  // Seed Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Beautiful 0 in Downtown',
      price: 1500,
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      address: '123 Main St',
      city: 'Metropolis',
      bedroom: 2,
      bathroom: 1,
      latitude: '40.712776',
      longitude: '-74.005974',
      type: 'rent',
      property: 'apartment',
      userId: user1.id,
      postDetail: {
        create: {
          desc: 'Spacious apartment with modern amenities.',
          utilities: 'Water, Electricity',
          pet: 'Allowed',
          income: 'Required',
          size: 800,
          school: 5,
          bus: 3,
          restaurant: 10,
        },
      },
    },
  });

  // Seed SavedPosts
  await prisma.savedPost.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  // Seed Chats
  const chat = await prisma.chat.create({
    data: {
      users: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
      seenBy: [user1.id, user2.id],
      lastMessage: 'Hello!',
    },
  });

  // Seed Messages
  await prisma.message.create({
    data: {
      text: 'Hi there!',
      userId: user1.id,
      chatId: chat.id,
    },
  });

  await prisma.message.create({
    data: {
      text: 'Hello!',
      userId: user2.id,
      chatId: chat.id,
    },
  });

  console.log('Seed data has been inserted.');
}

// Run the seed function and handle errors
main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

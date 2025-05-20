import { PrismaClient } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { SlugGeneratorService } from './slug-generator';


export async function isSlugTaken(
  prisma: PrismaClient,
  slug: string
): Promise<boolean> {
  const found = await prisma.link.findUnique({
    where: { shortSlug: slug }
  });
  console.log("find", found)
  return !!found;
}

export async function getAvaliableUniqueSlug(
  prisma: PrismaClient,
  shortSlug: string | undefined,
  slugGenerator: SlugGeneratorService,
): Promise<string> {
  if (shortSlug) {
    const exists = await isSlugTaken(prisma, shortSlug)
    if (exists) {
      throw new BadRequestException(`The slug "${shortSlug}" is already taken, please choose another one.`);
    }
    return shortSlug;
  } else {
    return await slugGenerator.generateUniqueSlug();
  }
}



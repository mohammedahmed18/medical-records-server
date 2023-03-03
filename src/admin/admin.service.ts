import { PrismaService } from './../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private db: PrismaService) {}

  async findAdminByUsername(username: string) {
    const admin = await this.db.admin.findFirst({ where: { username } });
    if (!admin) return null;
    return admin;
  }

  async findAdminByNationalId(nationalId: string) {
    const admin = await this.db.admin.findFirst({
      where: {
        user: {
          nationalId,
        },
      },
    });
    if (!admin) return null;
    return admin;
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class DoctorRequestService{
    constructor(private readonly prisma: PrismaService){}

    createDoctorRequest(){
        //
    }
    
}
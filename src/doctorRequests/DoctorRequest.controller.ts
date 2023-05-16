import {Controller, Post} from '@nestjs/common'
import { DOCTOR_REQUESTS_BASE_URL } from 'src/constants';
import { DoctorRequestService } from './DoctorRequest.service';

@Controller(DOCTOR_REQUESTS_BASE_URL)
export class DoctorRequestController{
    constructor(private readonly doctorRequestService: DoctorRequestService){

    }
    
    @Post()
    createDoctorRequests(){
        // this.doctorRequestService.createDoctorRequest
    } 
}
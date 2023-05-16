import { UseGuards, applyDecorators } from "@nestjs/common";
import { QrGuard } from "../gaurds/Qr.guard";


export const ValidateQrCode = () => applyDecorators(UseGuards(QrGuard));

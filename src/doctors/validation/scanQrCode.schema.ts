import * as Joi from "joi";

export const ScanQrCodeSchema = Joi.object({
    qrCode : Joi.string().required()
});

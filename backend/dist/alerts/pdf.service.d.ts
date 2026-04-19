export declare class PdfService {
    generateAlertsPdf(vehicleNumber: string, date: string, records: any[]): Promise<Buffer>;
    private generateHeader;
    private generateHr;
}

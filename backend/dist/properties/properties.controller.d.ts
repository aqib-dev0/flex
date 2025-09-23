import { PropertiesService } from './properties.service';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    getAllProperties(): Promise<any[]>;
    getPropertyById(id: string): Promise<any>;
}

export type User = any;
export declare class UsersService {
    private readonly users;
    findOne(email: string): Promise<User | undefined>;
    findOrCreateGoogleUser(profile: any): Promise<any>;
}

import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            name: any;
            role: any;
            avatar: any;
        };
    }>;
    googleAuth(req: any): Promise<void>;
    mockGoogleLogin(): Promise<{
        access_token: string;
        user: {
            email: any;
            sub: any;
            name: any;
            role: any;
            avatar: any;
        };
    }>;
    googleAuthRedirect(req: any): Promise<"No user from google" | {
        access_token: string;
        user: {
            email: any;
            sub: any;
            name: any;
            role: any;
            avatar: any;
        };
    }>;
    getProfile(req: any): any;
}

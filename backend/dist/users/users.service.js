"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
let UsersService = class UsersService {
    users = [
        {
            userId: 1,
            email: 'admin@masstrans.com',
            password: 'password123',
            name: 'John Carter',
            role: 'Admin',
            avatar: 'JC'
        },
        {
            userId: 2,
            email: 'user@masstrans.com',
            password: 'password123',
            name: 'Jane Doe',
            role: 'User',
            avatar: 'JD'
        }
    ];
    async findOne(email) {
        return this.users.find(user => user.email === email);
    }
    async findOrCreateGoogleUser(profile) {
        let user = this.users.find(u => u.email === profile.emails[0].value);
        if (!user) {
            const newUser = {
                userId: this.users.length + 1,
                email: profile.emails[0].value,
                password: 'google-auth-no-password',
                name: profile.displayName,
                role: 'User',
                avatar: profile.name?.givenName?.[0] || profile.displayName[0]
            };
            this.users.push(newUser);
            return newUser;
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map
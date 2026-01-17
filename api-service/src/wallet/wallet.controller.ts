import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport'; // <--- Використовуємо стандартний імпорт

// Інтерфейс для TypeScript, щоб він розумів структуру user
interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthGuard('jwt')) // <--- Використовуємо стандартну стратегію 'jwt'
  @Get()
  async getMyWallet(@Request() req: RequestWithUser) {
    return this.walletService.findOneByUserId(req.user.userId);
  }
}

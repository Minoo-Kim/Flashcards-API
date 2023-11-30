import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RequestWithUser } from 'src/decorators/user-id.decorator';
import { DecksService } from 'src/decks/decks.service';

@Injectable()
export class DeckOwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private deckService: DecksService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Get the user id from the request object
    const user = (request as RequestWithUser).user;
    const userId = user.userId;
    // The JWT strategy will throw an error if it fails to validate the token

    // Get the deck id from the request params
    const deckId = request.params.id;

    // If deckId is not provided
    if (!deckId) {
      throw new BadRequestException('Invalid or missing deck ID');
    }

    const deck = await this.deckService.findOne(deckId);

    // If deck does not exist
    if (!deck) {
      throw new NotFoundException(`Deck with ID ${deckId} not found`);
    }

    // Check if the deck belongs to the user
    return deck.userId == userId;
  }
}

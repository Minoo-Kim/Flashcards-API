import {
  Controller,
  Post,
  Patch,
  Query,
  Get,
  Param,
  Body,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './deck-create.dto';
import { DeckResponseDto } from './deck-response.dto';
import { UpdateDeckDto } from './deck-update.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserId } from '../decorators/user-id.decorator';
import { DeckOwnershipGuard } from 'src/guards/deck-owner.guard';
import { UserService } from 'src/user/user.service';

type DeckResponseWithPagination = {
  filter?: string;
  search?: string;
  data: DeckResponseDto[];
  pagination: {
    limit: number;
    offset: number;
  };
};

@UseGuards(JwtAuthGuard)
@Controller('decks')
export class DecksController {
  constructor(
    private readonly decksService: DecksService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() CreateDeckDto: CreateDeckDto,
    @UserId() userId: number,
  ): Promise<DeckResponseDto> {
    const deck = await this.decksService.create(CreateDeckDto, userId);
    delete deck.userId;
    return deck;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DeckResponseDto> {
    const deck = await this.decksService.findOne(id);
    if (!deck) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    delete deck.userId;
    return deck;
  }

  @UseGuards(JwtAuthGuard, DeckOwnershipGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateDeckDto: UpdateDeckDto,
  ): Promise<DeckResponseDto> {
    const deck = await this.decksService.update(id, UpdateDeckDto);
    delete deck.userId;
    return deck;
  }

  @UseGuards(JwtAuthGuard, DeckOwnershipGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeckResponseDto> {
    const deck = await this.decksService.remove(id);
    delete deck.userId;
    return deck;
  }

  @Get()
  async findAll(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('search') search: string,
    @Query('username') username?: string,
  ): Promise<DeckResponseWithPagination> {
    let userId: number | undefined;

    if (username) {
      const user = await this.userService.findOne(username);
      if (!user) {
        throw new NotFoundException(`User with username ${username} not found`);
      }
      userId = user.id;
    }

    const decks = await this.decksService.findAll(
      limit,
      offset,
      search,
      userId,
    );
    return {
      filter: username,
      search,
      pagination: {
        limit,
        offset,
      },
      data: decks.map((deck) => {
        delete deck.userId;
        return deck;
      }),
    };
  }
}

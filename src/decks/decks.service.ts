import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from './deck.entity';
import { CreateDeckDto } from './deck-create.dto';
import { UpdateDeckDto } from './deck-update.dto';

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private deckRepository: Repository<Deck>,
  ) {}

  async create(createDeckDto: CreateDeckDto, userId: number): Promise<Deck> {
    const deck = await this.deckRepository.create({
      ...createDeckDto,
      userId,
    });
    return this.deckRepository.save(deck);
  }

  async findOne(id: string): Promise<Deck | null> {
    return this.deckRepository.findOneBy({ id });
  }

  async update(id: string, updateDeckDto: UpdateDeckDto): Promise<Deck | null> {
    const deck = await this.deckRepository.preload({ id, ...updateDeckDto });
    if (!deck) {
      return null;
    }
    deck.updatedAt = new Date();
    return this.deckRepository.save(deck);
  }

  async remove(id: string): Promise<Deck | null> {
    const deck = await this.findOne(id);
    if (!deck) {
      return null;
    }
    return this.deckRepository.remove(deck);
  }

  async findAll(
    limit: number,
    offset: number,
    search?: string,
    userId?: number,
  ): Promise<Deck[]> {
    const queryBuilder = this.deckRepository.createQueryBuilder('decks');
    let hasWhereCondition = false;

    if (search !== undefined) {
      queryBuilder.where('decks.title ILIKE :search', {
        search: `%${search}%`,
      });
      hasWhereCondition = true;
    }

    if (userId !== undefined) {
      if (hasWhereCondition) {
        queryBuilder.andWhere('decks.userId = :userId', { userId });
      } else {
        queryBuilder.where('decks.userId = :userId', { userId });
        hasWhereCondition = true;
      }
    }

    queryBuilder.limit(limit);
    queryBuilder.offset(offset);

    queryBuilder.orderBy('decks.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }
}
